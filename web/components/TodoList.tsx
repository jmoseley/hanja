import { useMutation, useSubscription } from '@apollo/react-hooks';
import React, { FunctionComponent } from 'react';

import NewTodo from './NewTodo';

const TodoList: FunctionComponent = () => {
  const { loading: todosLoading, error, data } = useSubscription(TODO_SUB);
  const [saveTodo] = useMutation(CREATE_TODO_MUTATION);
  const [setCompleted] = useMutation(SET_COMPLETED);

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
