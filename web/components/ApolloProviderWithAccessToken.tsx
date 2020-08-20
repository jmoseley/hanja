import React, { useState, useEffect, FunctionComponent } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ApolloProvider } from '@apollo/react-hooks';
import { getApolloClient } from '../util/apolloClient';

const ApolloProviderWithAccessToken: FunctionComponent = (props) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently({
        audience: 'https://hasura.demo.com/v1/graphql',
      })
        .then((at) => {
          if (at) {
            setAccessToken(at);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [isAuthenticated]);

  const client = getApolloClient(accessToken);

  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
};

export default ApolloProviderWithAccessToken;
