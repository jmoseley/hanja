import React from 'react';
import { gql } from 'graphql-request';

import NewTodo from './NewTodo';
import { useFetchTodosSubscription, useCreateTodoMutation, useSetCompletedMutation } from '../generated/graphql';

const TodoList = () => {
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

TodoList.mutation = gql`
  mutation setCompleted($id: uuid!, $completed: Boolean!) {
    update_todos_by_pk(pk_columns: { id: $id }, _set: { completed: $completed }) {
      name
      completed
      id
    }
  }
`;

TodoList.subscription = gql`
  subscription fetchTodos {
    todos(order_by: { completed: asc, created_at: asc }) {
      id
      name
      completed
    }
  }
`;

TodoList.createTodo = gql`
  mutation createTodo($name: String) {
    insert_new_todo(name: $name) {
      id
      name
      completed
    }
  }
`;

export default TodoList;
