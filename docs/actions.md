# Actions

Actions are how you generate change in Mise. By triggering an action, you modify the state and create a new template.

```javascript
const actions = {
  increment: state => ({ state.counter + 1 }),
  decrement: state => ({ state.counter - 1 }),
};

```
#### State can only be modified by actions.

If you intend to modify the state, this needs to be done via an action.  Using the above example as a reference.

```js
  component({
    template: state => actions => (
      <div>
        <span>{state.counter}</span>
        <button onclick={actions.increment}>+</button>
        <button onclick={actions.decrement}>-</button>
      </div>
    ),
    actions,
    state: {
      counter: 0
    },
  });
```

By clicking the increment button, the increment action is dispatched and the state itself is updated. This is the **only** way to modify an application's state.

#### Actions can call other actions.

```javascript
const actions = {
  clearInput = state => ({ input: '' }),
  submit = (state, actions) => {
    const todo = { text: state.input };
    actions.clearInput();

    return { todos : [ ...state.todos, todo ] };
  };
}
```

#### Actions can take additional parameters.

```javascript
import { dom, component } from 'mise';

component({
  template: state => actions => (
    <div onclick={e => actions.eventHandler(e)}>
      click me!
    </div>
  ),
  state:
    //...
  actions: {
    eventHandler = (state, actions, event) => {
      if (e.button === 2) {
      // ...
    }
  }
})
```

#### Actions can provide thunks
> A thunk is a function that encapsulates synchronous or asynchronous code

Thunks allow developers a little leeway into *when* an application should re-render. You can delay a re-render until a certain condition is met via thunks

``` javascript
const actions = {
  getAlerts: (state, actions) => async update => {
    await data = actions.fetchAlerts(state.alertValue);

    if (data.shouldUpdate)
      update({ alerts: data.alerts });
  };
}
```

#### Testing

Testing actions is very straightforward. All actions should strive to be pure functions.

```javascript
import { actions } from './todos.actions';

let state = {};

beforeEach(
  state = {};
)

describe('todo actions', () => {
  it('should add the input to a todo', () => {
    const input = 'hello world!';
    expect(actions.addInput(state, actions, input)).toEqual({
      input,
    })
  });

  it ('should remove all todos', () => {
    state.todos = [{ id: 1, text: 'hello, world', } { id: 2, text: 'goodbye, world' }];

    expect(actions.removeTodos(state, actions)).toEqual({
      todos: [],
    });
  })
})
```
