import React, { FunctionComponent } from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { useApolloClient } from '../util/apolloClient';

const ApolloProviderWithAccessToken: FunctionComponent = (props) => {
  const client = useApolloClient();

  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
};

export default ApolloProviderWithAccessToken;
