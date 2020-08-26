import { NowRequest, NowResponse } from '@vercel/node';

export interface EventPayload<TTable> {
  event: {
    session_variables: { [key: string]: string };
  } & (
    | {
      op: 'INSERT' | 'MANUAL';
      data: {
        old: null;
        new: TTable;
      };
    }
    | {
      op: 'UPDATE';
      data: {
        old: TTable;
        new: TTable;
      };
    }
    | {
      op: 'DELETE';
      data: {
        old: TTable;
        new: null;
      };
    }
  );
  created_at: string;
  id: string;
  trigger: {
    name: string;
  };
  table: {
    schema: string;
    name: string;
  };
}

// Request Handler
const eventHandler = async (req: NowRequest, res: NowResponse) => {
  const eventPayload: EventPayload<{ id: string; name: string; completed: boolean }> = req.body;

  console.info(`Received event: `, JSON.stringify(eventPayload));

  // success
  return res.json({});
};

export default eventHandler;
