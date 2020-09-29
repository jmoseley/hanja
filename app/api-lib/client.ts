import { GraphQLClient } from 'graphql-request';
import { getSdk } from './generated/graphql';

const ENDPOINT = process.env.HASURA_ENDPOINT;

export interface Headers {
  [key: string]: string;
}

export function getHasuraClient(headers: Headers) {
  const client = new GraphQLClient(ENDPOINT, { headers });
  return getSdk(client);
}
