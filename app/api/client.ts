import { GraphQLClient } from 'graphql-request';
import { getSdk } from './generated/graphql';

// TODO[config]: Use a configurable endpoint for hasura
const ENDPOINT = 'http://localhost:8080/v1/graphql';

export interface Headers {
  [key: string]: string;
}

export function getHasuraClient(headers: Headers) {
  const client = new GraphQLClient(ENDPOINT, { headers });
  return getSdk(client);
}
