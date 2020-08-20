import React, { FunctionComponent } from 'react';

import NewTodo from './NewTodo';
import { useFetchTodosSubscription, useCreateTodoMutation, useSetCompletedMutation } from '../generated/graphql';

const TodoList: FunctionComponent = () => {
  const { loading: todosLoading, error, data } = useFetchTodosSubscription();
  const [saveTodo] = useCreateTodoMutation();
  const [setCompleted] = useSetCompletedMutation();

  if (!todosLoading && error) {
    console.error(error);
  }

  return (
    <div>
      {!todosLoading && error && <div>{error}</div>}
      {!todosLoading &&
        !error &&
        data.todos.map((a, i) => (
          <div
            key={i}
            onClick={() => {
              setCompleted({
                variables: { id: a.id, completed: !a.completed },
              });
            }}
          >
            {a.completed && (
              <del>
                <h2>{a.name}</h2>
              </del>
            )}
            {!a.completed && <h2>{a.name}</h2>}
          </div>
        ))}
      <NewTodo
        onSubmit={async (name) => {
          await saveTodo({ variables: { name } });
        }}
      />
    </div>
  );
};

export default TodoList;
