#!/usr/bin/env ts-node --project tsconfig.json

import fs from 'fs';
import path from 'path';
import ldKebabCase from 'lodash.kebabcase';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { Spinner } from 'clui';
import { random as randomStr } from '@supercharge/strings';

const main = async () => {
  // Collect data
  const { projectName } = await inquirer.prompt({ type: 'input', name: 'projectName', message: 'Project Name', });
  const { projectSlug } = await inquirer.prompt({ type: 'input', name: 'projectSlug', message: 'Project Slug', default: ldKebabCase(projectName) });

  const { auth0Setup } = await inquirer.prompt({
    type: 'confirm',
    name: 'auth0Setup',
    message: 'Have you set up your auth0 account (as describe in the Getting Started guide)?'
  });

  if (!auth0Setup) {
    chalk.yellow(`Please set up your auth0 account, following the instructions at https://jmoseley.github.io/hanja/getting_started.md#auth0`);
    process.exit(1);
  }

  const { auth0Domain, auth0ClientSecret, auth0ClientId } = await inquirer.prompt([{
    name: 'auth0Domain',
    type: 'input',
    message: 'Auth0 Domain',
    default: `${projectSlug}.us.auth0.com`,
  }, {
    name: 'auth0ClientId',
    type: 'input',
    message: 'Auth0 Client ID',
  }, {
    name: 'auth0ClientSecret',
    type: 'input',
    message: 'Auth0 Client Secret',
  }]);

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
  }]);

  let shouldWriteEnv = true;
  const envFilePath = path.join(process.cwd(), '.env')
  if (fs.existsSync(path.join(process.cwd(), '.env'))) {
    const { overwrite } = await inquirer.prompt({
      type: 'confirm',
      name: 'overwrite',
      message: `Overwrite existing .env file at '${envFilePath}'`,
      suffix: '?',
      prefix: '',
      default: false,
    });
    if (!overwrite) {
      shouldWriteEnv = false;
    }
  }

  if (shouldWriteEnv) {
    const spinner = new Spinner(`Writing data to .env...`);
    spinner.start();
    await new Promise<void>((resolve, reject) => {
      fs.writeFile(envFilePath, `PROJECT_NAME=${projectName}
PROJECT_SLUG=${projectSlug}
ADMIN_SECRET=${adminSecret}
EVENT_SECRET=${eventSecret}
ACTION_SECRET=${actionSecret}
AUTH0_DOMAIN=${auth0Domain}
AUTH0_CLIENT_ID=${auth0ClientId}
AUTH0_CLIENT_SECRET=${auth0ClientSecret}
`, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    });
    spinner.stop();
  }

  // TODO: Support custom domain names.
}

function randomStringFilter(value: string): string {
  if (value === '<random string>') {
    return randomStr(32);
  }
  return value;
}

main();