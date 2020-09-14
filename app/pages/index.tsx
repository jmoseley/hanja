import { Auth0Provider } from '@auth0/auth0-react';
import React, { FunctionComponent } from 'react';

import App from '../components/App';
import ApolloProviderWithAccessToken from '../components/ApolloProviderWithAccessToken';
import { getAppUrl } from '../util/appUrl';

const Index: FunctionComponent = () => {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      redirectUri={getAppUrl()}
      audience="https://hasura.demo.com/v1/graphql"
    >
      <ApolloProviderWithAccessToken>
        <App />
      </ApolloProviderWithAccessToken>
    </Auth0Provider>
  );
};

export default Index;
