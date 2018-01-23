import { commis } from '@mise/test';

import { dom, component } from '../../src';

const { render } = commis();

const TodoItem = ({
  id,
  text,
  done,
  toggle,
  clear,
  create,
  remove,
  update,
}) => (
  <li
    oncreate={create}
    onremove={remove}
    onupdate={update}
  >
    <span
      style={done ? { fontSize: "18px", textDecoration: "line-through" } : { fontSize: "18px" }}
      onclick={_ => toggle({ id })}>
      {text}
    </span>
    <span
      onclick={_ => clear({ id })}
      style={{ marginLeft: '10px', color: 'red', }}>
      x
    </span>
  </li>
);

describe('counter example', () => {
  const { body } = document;
  let input;

  const addTodo = (text = 'new todo') => {
    input = body.querySelector('input');
    input.value = text;

    input.dispatchEvent(new Event('input'));
    body.querySelector('#add').click();
  };

  const template = state => actions => (
    <div id="todos-test">
      <h1>Todos</h1>

      <ul id="todos" class="todos">
        {state.todos.map(todo => (
          <TodoItem
            create={() => {}}
            remove={() => {}}
            update={() => oldProps => oldProps}
            text={todo.text}
            id={todo.id}
            done={todo.done}
            toggle={actions.toggle}
            clear={actions.remove}
          />
        ))}
      </ul>

      <input
        type="text"
        value={state.value}
        oninput={e => actions.input({ value: e.target.value })}
      />
      <button
        id="add"
        onclick={actions.add}
      >
        Add Todo
      </button>
      <button
        id="clear"
        onclick={actions.clearTodos}
      >
        Clear Todos
      </button>
    </div>
  );

  beforeEach(async () => {
    body.innerHTML = '';

    component({
      template,
      state: {
        todos: [],
        input: '',
        id: 0,
        value: '',
      },
      actions: {
        add: (state, actions) => {
          const text = state.input;

          actions.clearInput();

          return {
            todos: [
              ...state.todos,
              {
                text,
                id: state.id,
                done: false,
              },
            ],
            id: state.id + 1,
          };
        },
        input: (state, actions, { value }) => ({ input: value }),
        toggle: (state, actions, { id }) => ({
          todos: state.todos.map(todo => (
            todo.id === id ? { ...todo, done: !todo.done } : todo)),
        }),
        remove: (state, actions, { id }) => ({ todos: state.todos.filter(todo => todo.id !== id) }),
        clearInput: () => ({ input: '' }),
        clearTodos: () => ({ todos: [] }),
      },
    });

    await render(75);
  });

  it('should load', async () => {
    expect(body.innerHTML).not.toBe('');
  });

  it('the initial state to not have any todos', async () => {
    expect(body.querySelector('#todos').childNodes.length).toBe(0);
  });

  it('should add a todo', async () => {
    addTodo();

    await render();
    expect(body.querySelector('#todos').childNodes.length).toBe(1);
  });

  it('should clear the input after adding a todo', async () => {
    addTodo();

    await render();
    expect(input.value).not.toBe('new todo');
  });

  it('should remove the todo', async () => {
    addTodo();

    await render();
    body.querySelector('#todos span:last-child').click();

    await render();
    expect(body.querySelector('#todos').childNodes.length).toBe(0);
  });

  it('should set the todo to done', async () => {
    const firstTodoSpanSelector = '#todos li:first-child span:first-child';

    addTodo();

    await render();
    body.querySelector(firstTodoSpanSelector).click();

    await render();
    expect(body.querySelector(firstTodoSpanSelector).outerHTML).toEqual('<span style="font-size: 18px; text-decoration: line-through;">new todo</span>');
  });

  it('should set the todo to done, then unset it', async () => {
    const firstTodoSpanSelector = '#todos li:first-child span:first-child';

    addTodo();

    await render();
    body.querySelector(firstTodoSpanSelector).click();

    await render();
    expect(body.querySelector(firstTodoSpanSelector).outerHTML).toEqual('<span style="font-size: 18px; text-decoration: line-through;">new todo</span>');

    await render();
    body.querySelector(firstTodoSpanSelector).click();

    await render();
    expect(body.querySelector(firstTodoSpanSelector).outerHTML).toEqual('<span style="font-size: 18px;">new todo</span>');
  });

  it('should remove all todos', async () => {
    addTodo();
    addTodo();
    addTodo();

    await render();
    expect(body.querySelector('#todos').childNodes.length).toBe(3);
    body.querySelector('#clear').click();

    await render();
    expect(body.querySelector('#todos').childNodes.length).toBe(0);
  });
});
