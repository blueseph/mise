import { TodoItem } from './todo/todo.template';

const template = state => actions => (
  <div>
    <h1>Todos</h1>
    <ul>
      {state.todos.map(todo =>
      (<TodoItem
        text={todo.text}
        id={todo.id}
        done={todo.done}
        toggle={actions.toggle}
        remove={actions.remove}
      />))}
    </ul>

    <input
      type="text"
      value={state.input}
      oninput={
        e => actions.input({ value: e.target.value })
      }
    />
    <button
      onclick={actions.add}
    >
      Add Todo
    </button>
    <button
      onclick={actions.clearTodos}
    >
      Clear All Todos
    </button>
  </div>
);

export { template };
