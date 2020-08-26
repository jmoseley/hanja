import { NowRequest, NowResponse } from '@vercel/node';
import { EventPayload } from './hasuraCustomTypes';

// Request Handler
const eventHandler = async (req: NowRequest, res: NowResponse) => {
  const eventPayload: EventPayload<{ id: string; name: string; completed: boolean }> = req.body;

  console.info(`Received event: `, JSON.stringify(eventPayload));

  // success
  return res.json({});
};

export default eventHandler;
