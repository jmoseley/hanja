import { NowRequest, NowResponse } from '@vercel/node';
import * as emoji from 'node-emoji';
import { Mutation_RootInsert_New_TodoArgs } from '../generated/graphql';
import { getHasuraClient } from '../client';

// Request Handler
const insertNewTodoHandler = async (req: NowRequest, res: NowResponse) => {
  // TODO: Validate secret
  console.log(req.body);
  // get request input
  let { name }: Mutation_RootInsert_New_TodoArgs = req.body.input;

  name = emoji.emojify(name);

  const client = getHasuraClient(// TODO: Properly handle session/auth headers
    {
      'x-hasura-admin-secret': 'admin-secret',
      'x-hasura-role': 'user',
      'x-hasura-user-id': req.body.session_variables['x-hasura-user-id'],
    });

  const result = await client.insertNewTodo({ name });

  // success
  return res.json({
    ...result.insert_todos_one,
  });
};

export default insertNewTodoHandler;
