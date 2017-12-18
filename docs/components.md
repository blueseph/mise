# Components

Components are how Mise wires together the template, state, and actions to render your application.

```javascript
import { dom, component } from '@mise/core';

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

#### Applications should only have one root-level component.

Your application should be structured in a way that only one root level component is ever necessary. Having a single, shared state and a single pool of actions allows you to do some pretty neat things.

* Load the state of your application from a local storage object
* Hydrate your SSR application with the proper state
* Easily automate bug reporting by passing the whole state and the action called to middleware.

It also forces you to keep your templates presentational. The assumption is that basically no logic should ever live in your templates. Templates can thus be really simple to maintain and to test.

#### Root items shouldn't have anything else in them.

Mise doesn't play nice with others. Please make sure your root items dont get anything added/removed to them. Mise works by diffing a VDOM and applying updates to the real DOM. The real DOM isn't the real source of truth, and as such it's possible for Mise to fall out of sync if the DOM changes out of Mise's purview.

