import { NowRequest, NowResponse } from '@vercel/node';
import fetch from 'node-fetch';
import * as emoji from 'node-emoji';

import { MutationInsert_New_TodoArgs } from '../hasuraCustomTypes';

const HASURA_OPERATION = `mutation insertNewTodo($name: String) {
  insert_todos_one(object: { name: $name }) {
    id
    name
    completed
  }
}`;

// execute the parent operation in Hasura
const execute = async (variables: { name: string }, headers: NowRequest['headers']) => {
  const fetchResponse = await fetch('http://localhost:8080/v1/graphql', {
    method: 'POST',
    headers: headers as { [key: string]: string },
    body: JSON.stringify({
      query: HASURA_OPERATION,
      variables,
    }),
  });
  const result = await fetchResponse.json();
  console.debug('DEBUG: ', JSON.stringify(result));
  return result;
};

// Request Handler
const insertNewTodoHandler = async (req: NowRequest, res: NowResponse) => {
  // get request input
  let { name }: MutationInsert_New_TodoArgs = req.body.input;

  name = emoji.emojify(name);

  const { data, errors } = await execute(
    { name },
    // TODO: Properly handle session/auth headers
    {
      'x-hasura-admin-secret': 'admin-secret',
      'x-hasura-role': 'user',
      'x-hasura-user-id': req.body.session_variables['x-hasura-user-id'],
    },
  );

  // if Hasura operation errors, then throw error
  if (errors) {
    return res.status(400).json(errors[0]);
  }

  // success
  return res.json({
    ...data.insert_todos_one,
  });
};

export default insertNewTodoHandler;
