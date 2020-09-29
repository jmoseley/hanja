#!/usr/bin/env ts-node --project tsconfig.json

import fs from 'fs';
import path from 'path';
import ldKebabCase from 'lodash.kebabcase';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { deploy } from 'auth0-deploy-cli';
import { ManagementClient } from 'auth0';
import capcon from 'capture-console';
import tempfile from 'tempfile';

import { randomStringFilter, executeCommand, writeJsonFile, spinOn, ExecError } from './util';
import { config } from 'shelljs';

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
}

const main = async () => {
  try {
    const configFilePath = path.join(process.cwd(), '../hanja-config.prod.json');
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
        message: 'Have you set up your auth0 account (as describe in the Getting Started guide)?'
      });

      if (!auth0Setup) {
        chalk.yellow(`Please set up your auth0 account, following the instructions at https://jmoseley.github.io/hanja/getting_started.md#auth0`);
        process.exit(1);
      }
    }

    const { domainName } = await inquirer.prompt({
      name: 'domainName',
      type: 'input',
      message: 'Domain Name for web app (optional)',
      default: null,
    }, existingConfig);

    const appUrl = `https://${domainName || `${projectSlug}.vercel.app`}`;

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
      default: `${appUrl}/logo.png`
    }], existingConfig);

    const { herokuTeam } = await inquirer.prompt({
      name: 'herokuTeam',
      type: 'input',
      message: 'Heroku Team Name (optional)',
    }, existingConfig);

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

    let shouldWriteConfig = true;
    if (fs.existsSync(configFilePath)) {
      const { overwrite } = await inquirer.prompt({
        type: 'confirm',
        name: 'overwrite',
        message: `Overwrite existing config file at '${configFilePath}'`,
        suffix: '?',
        prefix: '',
        default: false,
      });
      if (!overwrite) {
        shouldWriteConfig = false;
      }
    }

    const hasuraBaseUrl = `https://${projectSlug}.herokuapp.com`;
    const hasuraEndpoint = `${hasuraBaseUrl}/v1/graphql`;
    const auth0Url = `https://${auth0Domain}`;

    const updatedConfig: Config = {
      ...existingConfig,
      appUrl,
      projectName,
      projectSlug,
      herokuTeam,
      hasuraEndpoint,
      hasuraBaseUrl,
      auth0Domain,
      auth0CliClientId,
      auth0CliClientSecret,
      logoUrl,
      adminSecret,
      eventSecret,
      actionSecret,
      domainName,
    }

    if (shouldWriteConfig) {
      await spinOn(
        `Writing data to ${configFilePath}...`,
        `Wrote config to ${configFilePath}. This file contains secrets, and should be kept somewhere safe. However, it should NOT be committed to your repo, put it somewhere else.`,
        async () => {
          await writeJsonFile(configFilePath, {
            appUrl,
            projectName,
            projectSlug,
            herokuTeam,
            hasuraEndpoint,
            hasuraBaseUrl,
            auth0Domain,
            auth0CliClientId,
            auth0CliClientSecret,
            logoUrl,
            adminSecret,
            eventSecret,
            actionSecret,
            domainName,
          });
        });
    }

    // TODO: Programmatic usage of the Heroku cli.
    await spinOn(
      `Deploying Hasura...`,
      `Hasura deployed.`,
      async () => await executeCommand(`yarn deploy-hasura-heroku`, {
        PROJECT_SLUG: projectSlug,
        HEROKU_TEAM: herokuTeam,
        EVENT_SECRET: eventSecret,
        APP_URL: appUrl,
        ACTION_SECRET: actionSecret,
        ADMIN_SECRET: adminSecret,
        AUTH0_URL: auth0Url
      })
    );

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

    updatedConfig.auth0WebClientId = auth0WebClientId;
    if (shouldWriteConfig) {
      await spinOn(
        `Writing data to ${configFilePath}...`,
        `Wrote config to ${configFilePath}. This file contains secrets, and should be kept somewhere safe. However, it should NOT be committed to your repo, put it somewhere else.`,
        async () => {
          await writeJsonFile(configFilePath, updatedConfig);
        });
    }

    const vercelConfigFile = tempfile('.json');
    await spinOn(
      `Writing vercel config...`,
      `Wrote vercel config to temp file.`,
      async () => {
        await writeJsonFile(vercelConfigFile, buildVercelProdConfig(updatedConfig));
      }
    );

    await spinOn(
      `Deploying Vercel app...`,
      `Done deploying Vercel app. ${domainName
        ? `The domain (${domainName}) has been set as an alias for the project.
Please follow directions at https://vercel.com/jmoseley/${projectSlug}/settings/domains to ensure it is properly configured.`
        : ''
      }`,
      async () => {
        await executeCommand(`yarn deploy-app-vercel`, {
          VERCEL_CONFIG_FILE: vercelConfigFile,
          PROJECT_SLUG: projectSlug,
          HASURA_ENDPOINT: hasuraEndpoint,
          HASURA_ADMIN_SECRET: adminSecret,
          DOMAIN_NAME: domainName,
        });
      }
    );
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

function buildVercelProdConfig(config: Config) {
  const vercelConfig: Record<string, unknown> = {
    "version": 2,
    "env": {
      "NEXT_PUBLIC_HASURA_ENDPOINT": config.hasuraEndpoint,
      "HASURA_ENDPOINT": config.hasuraEndpoint,
      "HASURA_ADMIN_SECRET": config.adminSecret,
      "APP_ROOT": config.appUrl,
      "NEXT_PUBLIC_APP_ROOT": config.appUrl,
      "NEXT_PUBLIC_AUTH0_DOMAIN": config.auth0Domain,
      "NEXT_PUBLIC_AUTH0_CLIENT_ID": config.auth0WebClientId,
    },
    "build": {
      "env": {
        "NEXT_PUBLIC_HASURA_ENDPOINT": config.hasuraEndpoint,
        "HASURA_ENDPOINT": config.hasuraEndpoint,
        "HASURA_ADMIN_SECRET": config.adminSecret,
        "APP_ROOT": config.appUrl,
        "NEXT_PUBLIC_APP_ROOT": config.appUrl,
        "NEXT_PUBLIC_AUTH0_DOMAIN": config.auth0Domain,
        "NEXT_PUBLIC_AUTH0_CLIENT_ID": config.auth0WebClientId,
      }
    }
  };

  if (config.domainName) {
    vercelConfig.alias = [config.domainName];
  }

  return vercelConfig;
}