import { Auth0Provider } from '@auth0/auth0-react';
import React, { FunctionComponent } from 'react';

import App from '../components/App';
import ApolloProviderWithAccessToken from '../components/ApolloProviderWithAccessToken';

const Index: FunctionComponent = () => {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
      clientId="iqy45FZQ9Btr0f1J7qhd1ST23fjrIcD2"
      redirectUri={window.location.href}
      audience="https://hasura.demo.com/v1/graphql"
    >
      <ApolloProviderWithAccessToken>
        <App />
      </ApolloProviderWithAccessToken>
    </Auth0Provider>
  );
};

export default Index;
