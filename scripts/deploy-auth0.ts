#!/usr/bin/env ts-node

import { deploy } from 'auth0-deploy-cli';

const config = {
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_ALLOW_DELETE: false,
};

// TODO: Use cli tooling for variables and script input
if (!process.env.LOGO_URL) {
  console.error('Must provide a logo url as "LOGO_URL".');
  process.exit(1);
}
if (!process.env.APP_URL) {
  console.error('Must provide an application url as "APP_URL".');
  process.exit(1);
}
if (!process.env.HASURA_ENDPOINT) {
  console.error('Must provide Hasura endpoint as "HASURA_ENDPOINT".');
  process.exit(1);
}
if (!process.env.ADMIN_SECRET) {
  console.error('Must provide Hasura admin secret as "ADMIN_SECRET".');
  process.exit(1);
}

// Import tenant config into Auth0 account
deploy({
  input_file: '../auth0/tenant', // Input file for directory
  base_path: process.cwd(),
  config, // Option to sent in json as object
  env: true, // Allow env variable mappings from process.env
})
  .then(() => console.log('Auth0 config deployed successfully.'))
  .catch((err) => console.log(`Oh no, something went wrong. <%= "Error: ${err}" %>`));
