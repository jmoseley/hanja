#!/usr/bin/env ts-node --project tsconfig.json

import chalk from 'chalk';
import capcon from 'capture-console';
import { dump } from 'auth0-deploy-cli';
import fs from 'fs';
import path from 'path';
import { replaceInFile } from 'replace-in-file';

import { Config } from './configure_dev';

async function main() {
  try {
    const configFilePath = path.join(process.cwd(), '../hanja-config.dev.json');
    let config: Config = {} as Config;
    if (fs.existsSync(configFilePath)) {
      config = JSON.parse(
        await new Promise<string>((resolve, reject) => {
          fs.readFile(configFilePath, (err, value) => {
            if (err) {
              reject(err);
            } else {
              resolve(value.toString('utf8') || '{}');
            }
          });
        }),
      );
    } else {
      console.log(chalk.red(`No dev configuration found. Please run 'yarn dev'.`));
      process.exit(1);
    }

    console.log(chalk.blue('Downloading configuration from Auth0'));

    console.log(config);

    // capcon.startIntercept(process.stderr, () => null);
    // capcon.startIntercept(process.stdout, () => null);
    try {
      await dump({
        output_folder: '../auth0/tenant', // Input file for directory
        base_path: process.cwd(),
        config: {
          AUTH0_DOMAIN: config.auth0Domain,
          AUTH0_CLIENT_SECRET: config.auth0CliClientSecret,
          AUTH0_CLIENT_ID: config.auth0CliClientId,
          AUTH0_ALLOW_DELETE: false,
        }, // Option to sent in json as object
        env: false, // Disallow env variable mappings from process.env
      });

      // TODO: Fix this grossness
      // https://github.com/auth0/auth0-deploy-cli/issues/125
      for (const replacement of [
        [config.logoUrl, '##LOGO_URL##'],
        [config.appUrl, '##APP_URL##'],
        [config.hasuraEndpoint, '##HASURA_ENDPOINT##'],
        [config.adminSecret, '##ADMIN_SECRET##'],
        [config.projectName, '##PROJECT_NAME##'],
        [config.appUrl, '##APP_URL##'],
        [config.supportUrl, '##SUPPORT_URL##'],
      ]) {
        await replaceInFile({
          files: '../auth0/tenant/**/*.*',
          from: new RegExp(replacement[0], 'g'),
          to: replacement[1],
        });
      }
    } finally {
      // capcon.stopIntercept(process.stderr);
      // capcon.stopIntercept(process.stdout);
    }
  } catch (error) {
    console.error(error);
  }
}

main();
