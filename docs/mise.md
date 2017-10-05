# Mise (en place)

[Mise](https://en.wikipedia.org/wiki/Mise_en_place) is a fully-featured front-end application library with built-in state management. Mise focuses on using **component-based** architecture to create simple and re-usable bits of code to structure your application. You explicitly manipulate your state *only* via actions. Code paths are clearly defined and change in predictable ways. Applications are highly and rigorously testable.

```
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

* VDOM for fast rendering
* Managed state system
* Automatic handling of *thunks* (asynchronous actions)
* Small (2kb minified, 700 bytes minified)
