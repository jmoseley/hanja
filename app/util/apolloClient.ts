import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { HttpLink, ApolloClient, split, ApolloLink } from '@apollo/react-hooks';
import { Hermes } from 'apollo-cache-hermes';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { useAsync } from 'react-async-hook';

export function getHasuraEndpoint() {
  const browserSide = !!process.browser;
  return browserSide ? process.env.NEXT_PUBLIC_HASURA_ENDPOINT as string : process.env.HASURA_ENDPOINT as string;
}

const APOLLO_CACHE = new Hermes();

function getApolloClient(accessToken: string | null) {
  const headers = !!accessToken
    ? {
      Authorization: `Bearer ${accessToken}`,
    }
    : undefined;


  const browserSide = !!process.browser;
  const hasuraEndpoint = getHasuraEndpoint();

  const httpLink = new HttpLink({
    uri: hasuraEndpoint,
    headers,
  });

  let splitLink: ApolloLink = httpLink;
  let wsLink: WebSocketLink | null = null;
  // No websockets on the server side, so only split in the browser.
  if (browserSide) {
    const endpointUrl = new URL(hasuraEndpoint);
    const isSecure = endpointUrl.protocol === 'https:';
    endpointUrl.protocol = isSecure ? 'wss' : 'ws';
    const websocketEndpoint = endpointUrl.href;

    wsLink = new WebSocketLink(
      new SubscriptionClient(websocketEndpoint, {
        connectionParams: { headers },
        reconnect: true,
      }),
    )

    splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        const result = definition.kind === 'OperationDefinition' && definition.operation === 'subscription';

        return result;
      },
      wsLink,
      httpLink,
    )
  }

  return new ApolloClient({
    link: splitLink,
    cache: APOLLO_CACHE,
  });
}

export function useApolloClient() {
  const accessToken = useAccessToken();
  const [client, setClient] = useState(getApolloClient(null));

  useEffect(() => {
    setClient(getApolloClient(accessToken));
  }, [accessToken]);

  return client;
}

function useAccessToken() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useAsync(async () => {
    if (isAuthenticated) {
      const at = await getAccessTokenSilently({
        audience: 'https://hasura.demo.com/v1/graphql',
      });

      setAccessToken(at);
    }
  }, [isAuthenticated]);

  return accessToken;
}
