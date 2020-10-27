import { NowRequest, NowResponse } from '@vercel/node';
import * as emoji from 'node-emoji';
import gql from 'graphql-tag';

import { Mutation_RootInsert_New_TodoArgs } from '../../api-lib/generated/graphql';
import { getHasuraClient } from '../../api-lib/client';

// Request Handler
const insertNewTodoHandler = async (req: NowRequest, res: NowResponse) => {
  // get request input
  let { name }: Mutation_RootInsert_New_TodoArgs = req.body.input;

  name = emoji.emojify(name);

  const client = getHasuraClient(
    // TODO: Properly handle session/auth headers
    {
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
      'x-hasura-role': 'user',
      'x-hasura-user-id': req.body.session_variables['x-hasura-user-id'],
    },
  );

  if (!req.body.session_variables['x-hasura-user-id']) {
    return res.status(500).send({
      error: 'No user id',
      'error-code': 'no-user-id',
    });
  }

  const fetchUserResult = await client.fetchUser({ auth0Id: req.body.session_variables['x-hasura-user-id'] });
  if (!fetchUserResult.users[0]) {
    return res.status(500).send({
      error: 'User not found',
      'error-code': 'user-not-found',
    });
  }

  const result = await client.insertNewTodo({ name, userId: fetchUserResult.users[0].id });

  // success
  return res.json({
    ...result.insert_todos_one,
  });
};

insertNewTodoHandler.mutation = gql`
  mutation insertNewTodo($name: String!, $userId: uuid!) {
    insert_todos_one(object: { name: $name, user_id: $userId }) {
      id
      name
      completed
    }
  }
`;

insertNewTodoHandler.query = gql`
  query fetchUser($auth0Id: String!) {
    users(where: { auth0_id: { _eq: $auth0Id } }) {
      id
      email
      name
    }
  }
`;

export default insertNewTodoHandler;
