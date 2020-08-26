export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  uuid: string;
};

export type Insert_New_Todo_Output = {
  __typename?: 'insert_new_todo_output';
  completed: Scalars['Boolean'];
  id: Scalars['uuid'];
  name: Scalars['String'];
};

export type InsertNewTodoOutput = {
  __typename?: 'InsertNewTodoOutput';
  completed: Scalars['Boolean'];
  id: Scalars['uuid'];
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  insert_new_todo?: Maybe<Insert_New_Todo_Output>;
};

export type MutationInsert_New_TodoArgs = {
  name?: Maybe<Scalars['String']>;
};

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
