# Local Development

1. Setup a new Auth0 Tenant for local development, by following [the guide](./deploy_auth0.md).
1. Run `yarn dev`, and enter the information. You will only need to enter the data once. This script will deploy the Auth0 infrastructure and start services in watch mode.
1. You will now have NextJS, Hasura running locally, interacting with Auth0 in the cloud.

## Modifying the Schema

As you build your app you will need to make changes to the schema. The simplest way is to use the Hasura console to update your data model, and migrations will be persisted in the `hasura` folder.

Start the console by running `yarn hasura-local console` in a separate terminal window. This will start the Hasura console and allow you to make modifications. See the [Hasura Docs](https://hasura.io/docs/1.0/graphql/core/index.html) for more information and instructions on how to make changes.
