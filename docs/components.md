# Components

Components are how Mise wires together the template, state, and actions to render your application.

```javascript
import { dom, component } from 'mise';

component({
  template: state => actions => (
    <div>
      <span>{state.counter}</span>
      <button onclick={actions.increment}>+</button>
      <button onclick={actions.decrement}>-</button>
    </div>
  ),
  state: {
    counter: 0,
  },
  actions: {
    increment: state => ({ counter: state.counter + 1 }),
    decrement: state => ({ counter: state.counter - 1 }),
  },
  root: document.querySelector('#app'),
});
```
