import { Auth0Provider } from '@auth0/auth0-react';
import React, { FunctionComponent } from 'react';

import App from '../components/App';
import ApolloProviderWithAccessToken from '../components/ApolloProviderWithAccessToken';

const Index: FunctionComponent = () => {
  return (
    <Auth0Provider
      domain="herokunextjsauth0.auth0.com"
      clientId="iqy45FZQ9Btr0f1J7qhd1ST23fjrIcD2"
      // TODO[localhost]
      redirectUri="http://localhost:3000/"
      audience="https://hasura.demo.com/v1/graphql"
    >
      <ApolloProviderWithAccessToken>
        <App />
      </ApolloProviderWithAccessToken>
    </Auth0Provider>
  );
};

export default Index;
