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
  let add;
  let clear;
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
                  //console.log(oldProps);
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
    input = body.querySelector('input');
    add = body.querySelector('#add');
    clear = body.querySelector('#clear');

    addTodo = (text = 'new todo') => {
      input.value = text;

      input.dispatchEvent(new Event('input'));
      add.click();
    };
  });

  // it('should load', () => {
  //   expect(body).not.toBe('');
  // });
  //
  // it('the initial state to not have any todos', () => {
  //   expect(body.querySelector('#todos').childNodes.length).toBe(0);
  // });
  //
  // it('should add a todo', (done) => {
  //   addTodo();
  //
  //   requestAnimationFrame(() => {
  //     expect(body.querySelector('#todos').childNodes.length).toBe(1);
  //     done();
  //   });
  // });
  //
  // it('should clear the input after adding a todo', (done) => {
  //   addTodo();
  //
  //   requestAnimationFrame(() => {
  //     expect(input.value).toBe('');
  //     done();
  //   });
  // });
  //
  // it('should remove the todo', (done) => {
  //   addTodo();
  //
  //   requestAnimationFrame(() => {
  //     body.querySelector('#todos span:last-child').click();
  //
  //     requestAnimationFrame(() => {
  //       expect(body.querySelector('#todos').childNodes.length).toBe(0);
  //       done();
  //     });
  //   });
  // });
  //
  // it('should remove all todos', (done) => {
  //   addTodo();
  //   addTodo();
  //   addTodo();
  //
  //   requestAnimationFrame(() => {
  //     expect(body.querySelector('#todos').childNodes.length).toBe(3);
  //     clear.click();
  //
  //     requestAnimationFrame(() => {
  //       expect(body.querySelector('#todos').childNodes.length).toBe(0);
  //       done();
  //     });
  //   });
  // });
});
