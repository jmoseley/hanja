import { deploy } from 'auth0-deploy-cli';

const config = {
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_ALLOW_DELETE: false,
};

// TODO: Remove these defaults
process.env.LOGO_URL = "https://jmoseley.github.io/hanja/assets/hanja_logo.png";
process.env.APP_URL = "https://jmolseley.github.io/hanja";
process.env.HASURA_ENDPOINT = "https://ngrok.io/blah";
process.env.ADMIN_SECRET = "admin-secret";

// Import tenant config into Auth0 account
deploy({
  input_file: './tenant', // Input file for directory
  base_path: process.cwd(),
  config, // Option to sent in json as object
  env: true, // Allow env variable mappings from process.env
})
  .then(() => console.log('Auth0 config deployed successfully.'))
  .catch((err) => console.log(`Oh no, something went wrong. <%= "Error: ${err}" %>`));
