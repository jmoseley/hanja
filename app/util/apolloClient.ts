import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { HttpLink, ApolloClient, split } from '@apollo/react-hooks';
import { Hermes } from 'apollo-cache-hermes';
import { SubscriptionClient } from 'subscriptions-transport-ws';

export function getApolloClient(accessToken: string) {
  const headers = !!accessToken
    ? {
      Authorization: `Bearer ${accessToken}`,
    }
    : undefined;

  const browserSide = !!process.browser;
  const hasuraEndpoint = browserSide ? process.env.NEXT_PUBLIC_HASURA_ENDPOINT : process.env.HASURA_ENDPOINT;

  const httpLink = new HttpLink({
    uri: hasuraEndpoint,
    headers,
  });

  let wsLink: WebSocketLink | null = null;
  // No websockets on the serverside.
  if (browserSide) {
    const endpointUrl = new URL(hasuraEndpoint);
    const isSecure = endpointUrl.protocol === 'https:';
    endpointUrl.protocol = isSecure ? 'wss' : 'ws';
    const websocketEndpoint = endpointUrl.href;

    wsLink = new WebSocketLink(
      new SubscriptionClient(websocketEndpoint, {
        connectionParams: { headers },
      }),
    )
  }

  // No websockets on the server side, so only split in the browser.
  const splitLink = process.browser
    ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        const result = definition.kind === 'OperationDefinition' && definition.operation === 'subscription';

        return result;
      },
      wsLink,
      httpLink,
    )
    : httpLink;

  return new ApolloClient({
    link: splitLink,
    cache: new Hermes(),
  });
}
