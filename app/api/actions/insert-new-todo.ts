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

  const result = await client.insertNewTodo({ name });

  // success
  return res.json({
    ...result.insert_todos_one,
  });
};

insertNewTodoHandler.mutation = gql`
  mutation insertNewTodo($name: String) {
    insert_todos_one(object: { name: $name }) {
      id
      name
      completed
    }
  }
`;

export default insertNewTodoHandler;
