const TodoList = ({ todos }) => (
  <div>
    {todos && todos.length && todos.map((a, i) => (
      <div key={i}>
        <h2>{a.name}</h2>
      </div>
    ))}
    {(!todos || todos.length === 0) && <div>No todos.</div>}
  </div>
)

export default TodoList;
