import { dom, component } from 'mise';

let todoId = 0;
const spanStyle = {
  marginLeft: '10px',
  color: 'red',
};

const TodoItem = ({ id, text, done, toggle, remove }) =>
  <li>
    <div
      onclick={() => toggle({id})}
      style={done ? {textDecoration: 'line-through' } : {}}>
      {text}
    </div>
    <span
      onclick={() => remove({ id })}
      style={spanStyle}>
      x</span>
  </li>;

component({
  template: state => actions => (
    <div>
      <h1>Todos</h1>
      <ul>
        {state.todos.map(todo =>
            <TodoItem
              text={todo.text}
              id={todo.id}
              done={todo.done}
              toggle={actions.toggle}
              remove={actions.remove} />
        )}
      </ul>

      <input
        type="text"
        value={state.input}
        oninput = {e => actions.input({ value: e.target.value })}/>
      <button
        onclick={actions.add}>Add Todo</button>
      <button
        onclick={actions.clearTodos}>Clear All Todos</button>
    </div>
  ),
  state: {
    todos: [],
    input: '',
  },
  actions: {
    add: (state, actions) => {
      const text = state.input;
      actions.clearInput();
      return { todos: [...state.todos, { text, id: todoId++, done: false  }] };
    },
    input: (state, actions, { value }) => ({ input: value }),
    toggle: (state, actions, { id }) => ({
      todos: state.todos.map(todo => todo.id === id ? Object.assign({}, todo, { done: !todo.done }) : todo),
    }),
    remove: (state, actions, { id }) => ({ todos: state.todos.filter(todo => todo.id !== id )}),
    clearInput: () => ({ input: '' }),
    clearTodos: () => ({ todos : [] }),
  },
});
