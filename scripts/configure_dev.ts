#!/usr/bin/env ts-node --project tsconfig.json

import fs from 'fs';
import path from 'path';
import ldKebabCase from 'lodash.kebabcase';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { deploy } from 'auth0-deploy-cli';
import { ManagementClient } from 'auth0';
import capcon from 'capture-console';

import { randomStringFilter, writeJsonFile, spinOn, ExecError } from './util';

interface Config {
  appUrl: string,
  projectName: string,
  projectSlug: string,
  hasuraEndpoint: string,
  hasuraBaseUrl: string,
  herokuTeam: string,
  auth0Domain: string,
  auth0CliClientId: string,
  auth0CliClientSecret: string,
  auth0WebClientId: string,
  logoUrl: string,
  adminSecret: string,
  eventSecret: string,
  actionSecret: string,
  domainName: string | null,
  graphqlDomainName: string | null,
}

const main = async () => {
  try {
    const configFilePath = path.join(process.cwd(), '../hanja-config.dev.json');
    let existingConfig: Config = {} as Config;
    if (fs.existsSync(configFilePath)) {
      existingConfig = JSON.parse(await new Promise<string>((resolve, reject) => {
        fs.readFile(configFilePath, (err, value) => {
          if (err) {
            reject(err);
          } else {
            resolve(value.toString('utf8') || '{}');
          }
        });
      }));
    }

    // Collect data
    const { projectName } = await inquirer.prompt({ type: 'input', name: 'projectName', message: 'Project Name', }, existingConfig);
    const { projectSlug } = await inquirer.prompt({ type: 'input', name: 'projectSlug', message: 'Project Slug', default: ldKebabCase(projectName) }, existingConfig);

    if (!existingConfig.auth0CliClientId) {
      const { auth0Setup } = await inquirer.prompt({
        type: 'confirm',
        name: 'auth0Setup',
        message: 'Have you set up your auth0 account (as describe in the Getting Started guide)? You should have a separate Auth0 Tenant for each developer and production.'
      });

      if (!auth0Setup) {
        chalk.yellow(`Please set up your auth0 account, following the instructions at https://jmoseley.github.io/hanja/getting_started.md#auth0`);
        process.exit(1);
      }
    }

    const appUrl = `http://localhost:3000`;

    // Auth0 requires the support URL to not be 'localhost', so use something else. TODO: Make this configurable.
    const supportUrl = `https://jmoseley.github.io/hanja`

    console.log(chalk.blue(`Please enter Auth0 data`));
    const { auth0Domain, auth0CliClientId, auth0CliClientSecret, logoUrl } = await inquirer.prompt([{
      name: 'auth0Domain',
      type: 'input',
      message: 'Auth0 Domain',
      default: `${projectSlug}.us.auth0.com`,
    }, {
      name: 'auth0CliClientId',
      type: 'input',
      message: 'Auth0 CLI App Client ID',
    }, {
      name: 'auth0CliClientSecret',
      type: 'password',
      message: 'Auth0 CLI Client Secret',
    }, {
      name: 'logoUrl',
      message: 'Logo Url (to personalize the login screen)',
      default: `${supportUrl}/logo.png`
    }], existingConfig);

    console.log(chalk.blue(`Please enter Hasura secrets`));
    const { adminSecret, eventSecret, actionSecret } = await inquirer.prompt([{
      name: 'adminSecret',
      message: 'Admin Secret',
      default: `<random string>`,
      filter: randomStringFilter
    }, {
      name: 'eventSecret',
      message: 'Event Webhook Secret',
      default: `<random string>`,
      filter: randomStringFilter
    }, {
      name: 'actionSecret',
      message: 'Actions Webhook Secret',
      default: `<random string>`,
      filter: randomStringFilter
    }], existingConfig);

    const hasuraBaseUrl = process.env['HASURA_PUBLIC_URL'] || `http://localhost:8080`;
    const hasuraEndpoint = `${hasuraBaseUrl}/v1/graphql`;
    const auth0Url = `https://${auth0Domain}`;

    const updatedConfig: Config = {
      ...existingConfig,
      appUrl,
      projectName,
      projectSlug,
      hasuraEndpoint,
      hasuraBaseUrl,
      auth0Domain,
      auth0CliClientId,
      auth0CliClientSecret,
      logoUrl,
      adminSecret,
      eventSecret,
      actionSecret,
    }

    await spinOn(
      `Writing data to ${configFilePath}...`,
      `Wrote config to ${configFilePath}. This file contains secrets, and should be kept somewhere safe. However, it should NOT be committed to your repo, put it somewhere else.`,
      async () => {
        await writeJsonFile(configFilePath, updatedConfig);
      });

    let auth0WebClientId: string | undefined = undefined;
    await spinOn(
      `Deploying Auth0 configuration...`,
      `Auth0 configuration deployed.`,
      async () => {
        capcon.startIntercept(process.stderr, () => null);
        capcon.startIntercept(process.stdout, () => null);
        try {
          await deploy({
            input_file: '../auth0/tenant', // Input file for directory
            base_path: process.cwd(),
            config: {
              AUTH0_DOMAIN: auth0Domain,
              AUTH0_CLIENT_SECRET: auth0CliClientSecret,
              AUTH0_CLIENT_ID: auth0CliClientId,
              AUTH0_ALLOW_DELETE: false,
              AUTH0_KEYWORD_REPLACE_MAPPINGS: {
                LOGO_URL: logoUrl,
                APP_URL: appUrl,
                HASURA_ENDPOINT: hasuraEndpoint,
                ADMIN_SECRET: adminSecret,
                PROJECT_NAME: projectName,
                SUPPORT_URL: supportUrl,
              }
            }, // Option to sent in json as object
            env: false, // Disallow env variable mappings from process.env
          });
        } finally {
          capcon.stopIntercept(process.stderr);
          capcon.stopIntercept(process.stdout);
        }

        // Need to query the management API to get the ClientID of the web app that was just created.
        const auth0ManagementApi = new ManagementClient({
          domain: auth0Domain,
          clientId: auth0CliClientId,
          clientSecret: auth0CliClientSecret,
          scope: "read:clients",
          audience: `${auth0Url}/api/v2/`,
          tokenProvider: {
            enableCache: true,
            cacheTTLInSeconds: 10
          }
        });
        const clients = await auth0ManagementApi.getClients({ fields: ['client_id', 'name', 'app_type'] });

        // The deployer might have changed the name of the app.
        auth0WebClientId = clients.find(c => c.name === 'hanja-web').client_id;
        if (!auth0WebClientId) {
          // The deployer might have changed the name of the app. If they did, just pick one that is an SPA.
          auth0WebClientId = clients.find(c => c.app_type === 'spa').client_id;

          if (!auth0WebClientId) {
            console.log(chalk.red(`Unable to find Auth0 SPA app! Exiting...`));
            process.exit(1);
          }
        }
      }
    );

    // Rewrite the config to save the web client id.
    if (updatedConfig.auth0WebClientId !== auth0WebClientId) {
      updatedConfig.auth0WebClientId = auth0WebClientId;
      await spinOn(
        `Writing data to ${configFilePath}...`,
        `Wrote config to ${configFilePath}. This file contains secrets, and should be kept somewhere safe. However, it should NOT be committed to your repo, put it somewhere else.`,
        async () => {
          await writeJsonFile(configFilePath, updatedConfig);
        });
    }
    
  } catch (error) {
    console.error(`Got an error.`);

    if (error instanceof ExecError) {
      console.error(`Exec error. Code: ${error.code} Signal: ${error.signal}`);
      console.error(`stdout\n`, error.stdout);
      console.error(`stderr\n`, error.stderr);
    } else if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
  }
}

main();