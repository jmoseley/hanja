// import { split, HttpLink, ApolloClient } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { HttpLink, ApolloClient, split } from "@apollo/react-hooks";
import { Hermes } from "apollo-cache-hermes";
import { SubscriptionClient } from "subscriptions-transport-ws";

export function getApolloClient(accessToken) {
  const headers = !!accessToken
    ? {
        Authorization: `Bearer ${accessToken}`,
      }
    : undefined;

  const httpLink = new HttpLink({
    uri: "http://localhost:8080/v1/graphql",
    headers,
  });

  // No websockets on the serverside.
  const wsLink = process.browser
    ? new WebSocketLink(
        new SubscriptionClient(`ws://localhost:8080/v1/graphql`, {
          connectionParams: { headers },
        })
      )
    : null;

  // No websockets on the server side, so only split in the browser.
  const splitLink = process.browser
    ? split(
        ({ query }) => {
          console.log(query);
          const definition = getMainDefinition(query);
          const result =
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription";

          console.log(result);

          return result;
        },
        wsLink,
        httpLink
      )
    : httpLink;

  return new ApolloClient({
    link: splitLink,
    cache: new Hermes(),
  });
}
