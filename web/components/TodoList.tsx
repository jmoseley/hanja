import {
  gql,
  useMutation,
  useSubscription,
} from "@apollo/react-hooks";
import NewTodo from "./NewTodo";
import { FunctionComponent } from "react";

const TODO_SUB = gql`
  subscription fetchTodos {
    todos(order_by: {completed: asc, created_at: asc}) {
      id
      name
      completed
    }
  }
`;

const CREATE_TODO_MUTATION = gql`
  mutation createTodo($name: String) {
    insert_todos_one(object: { name: $name, completed: false }) {
      id
      name
      completed
    }
  }
`;

const SET_COMPLETED = gql`
  mutation setCompleted($id: uuid!, $completed: Boolean!) {
    update_todos_by_pk(
      pk_columns: { id: $id }
      _set: { completed: $completed }
    ) {
      name
      completed
      id
    }
  }
`;

const TodoList: FunctionComponent<{}> = () => {
  const { loading: todosLoading, error, data } = useSubscription(TODO_SUB);
  const [saveTodo] = useMutation(
    CREATE_TODO_MUTATION
  );
  const [setCompleted] = useMutation(
    SET_COMPLETED
  );

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
