# Deploy Auth0

1. Have Hasura and the app deployed (Docs TBD)
1. Create a new account/tenant.
1. Delete `Default Application`.
1. Add the `auth0-deploy-cli` extension.
1. Obtain the domain, client id, and client secret for the `auth0-deploy-cli-extension` application.
1. Run `AUTH0_DOMAIN="<domain>" AUTH0_CLIENT_ID="<client id>" AUTH0_CLIENT_SECRET="<client secret>" HASURA_ENDPOINT="<hasura endpoint>" LOGO_URL="<address of logo image>" APP_URL="<app root url>" ADMIN_SECRET="<admin secret for hasura>" yarn deploy-auth0`
