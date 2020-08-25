import { NowRequest, NowResponse } from '@vercel/node';

import insertNewTodoHandler from '../handlers/insert-new-todo';

// Request Handler
const handler = async (req: NowRequest, res: NowResponse) => {
  const actionName: string = req.body.action.name;
  switch (actionName) {
    case 'insert_new_todo':
      return await insertNewTodoHandler(req, res);
    default:
      res.status(400).json({ error: 'unknown action' });
      return;
  }
};

export default handler;
