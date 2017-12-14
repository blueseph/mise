const add = (state, actions) => {
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
};

const input = (state, actions, { value }) => ({ input: value });

const toggle = (state, actions, { id }) => ({
  todos: state.todos.map(todo => (todo.id === id ? { ...todo, done: !todo.done } : todo)),
});

const remove = (state, actions, { id }) => ({ todos: state.todos.filter(todo => todo.id !== id )});

const clearInput = () => ({ input: '' });

const clearTodos = () => ({ todos: [] });

export {
  add,
  input,
  toggle,
  remove,
  clearInput,
  clearTodos,
};
