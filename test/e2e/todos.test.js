import { dom, component } from '../../src';
import { requestAnimationFrame, requestIdleCallback } from '../utils';

window.requestAnimationFrame = requestAnimationFrame;
window.requestIdleCallback = requestIdleCallback;

const TodoItem = ({
  id, text, done, toggle, clear, create, remove, update,
}) =>
  dom(
    'li',
    {
      oncreate: create,
      onremove: remove,
      onupdate: update,
    },
    dom(
      'span',
      {
        onclick: function onclick() {
          return toggle({ id });
        },
        style: done ? { userSelect: 'none', textDecoration: 'line-through' } : { userSelect: 'none' },
      },
      text,
    ),
    dom(
      'span',
      {
        onclick: function onclick() {
          return clear({ id });
        },
        style: {
          marginLeft: '10px',
          color: 'red',
        },
      },
      'x',
    ),
  );

describe('counter example', () => {
  let body;
  let input;
  let addTodo;

  beforeEach(() => {
    document.body.innerHTML = '';

    component({
      template: state => actions => (
        dom(
          'div',
          null,
          dom(
            'h1',
            null,
            'Todos',
          ),
          dom(
            'ul',
            {
              id: 'todos',
              className: 'todos',
            },
            state.todos.map(todo => dom(TodoItem, {
              create: function create() {

              },
              remove: function remove() {
                return function finish(done) {
                  done();
                };
              },
              update: function update() {
                return function checkOldProps(oldProps) {
                  return oldProps;
                };
              },
              text: todo.text,
              id: todo.id,
              done: todo.done,
              toggle: actions.toggle,
              clear: actions.remove,
            })),
          ),
          dom('input', {
            type: 'text',
            value: state.input,
            oninput: function oninput(e) {
              return actions.input({ value: e.target.value });
            },
          }),
          dom(
            'button',
            {
              onclick: actions.add,
              id: 'add',
            },
            'Add Todo',
          ),
          dom(
            'button',
            {
              onclick: actions.clearTodos,
              id: 'clear',
            },
            'Clear All Todos',
          ),
        )
      ),
      state: {
        todos: [],
        input: '',
        id: 0,
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

    body = document.body;

    addTodo = (text = 'new todo') => {
      input = document.body.querySelector('input');
      input.value = text;

      input.dispatchEvent(new Event('input'));
      body.querySelector('#add').click();
    };
  });

  it('should load', (done) => {
    setTimeout(() => {
      expect(body.innerHTML).not.toBe('');
      done();
    }, 25);
  });

  it('the initial state to not have any todos', (done) => {
    setTimeout(() => {
      expect(body.querySelector('#todos').childNodes.length).toBe(0);
      done();
    }, 25);
  });

  it('should add a todo', (done) => {
    setTimeout(() => {
      addTodo();

      setTimeout(() => {
        expect(body.querySelector('#todos').childNodes.length).toBe(1);
        done();
      }, 25);
    }, 25);
  });

  it('should clear the input after adding a todo', (done) => {
    setTimeout(() => {
      addTodo();

      setTimeout(() => {
        expect(input.value).toBe('');
        done();
      }, 25);
    }, 25);
  });

  it('should remove the todo', (done) => {
    setTimeout(() => {
      addTodo();

      setTimeout(() => {
        body.querySelector('#todos span:last-child').click();

        setTimeout(() => {
          expect(body.querySelector('#todos').childNodes.length).toBe(0);
          done();
        }, 25);
      }, 25);
    }, 25);
  });

  it('should remove all todos', (done) => {
    setTimeout(() => {
      addTodo();
      addTodo();
      addTodo();

      setTimeout(() => {
        expect(body.querySelector('#todos').childNodes.length).toBe(3);
        body.querySelector('#clear').click();

        setTimeout(() => {
          expect(body.querySelector('#todos').childNodes.length).toBe(0);
          done();
        }, 25);
      }, 25);
    }, 25);
  });
});
