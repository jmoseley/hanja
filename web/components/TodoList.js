import {
  useQuery,
  gql,
  useMutation,
  useSubscription,
} from "@apollo/react-hooks";
import NewTodo from "./NewTodo";

const TODO_SUB = gql`
  subscription fetchTodos {
    todos {
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

const TodoList = () => {
  const { loading: todosLoading, error, data } = useSubscription(TODO_SUB);
  const [saveTodo, { loading: createLoading }] = useMutation(
    CREATE_TODO_MUTATION
  );
  const [setCompleted, { loading: setCompletedLoading }] = useMutation(
    SET_COMPLETED
  );

  if (!todosLoading && error) {
    console.error(error);
  }

  return (
    <div>
      {createLoading && <div>Saving...</div>}
      {todosLoading && <div>Loading...</div>}
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
              <strike>
                <h2>{a.name}</h2>
              </strike>
            )}
            {!a.completed && <h2>{a.name}</h2>}
          </div>
        ))}
      <NewTodo
        onSubmit={(name) => {
          saveTodo({ variables: { name } });
        }}
      />
    </div>
  );
};

export default TodoList;
