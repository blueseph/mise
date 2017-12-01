# State

State has proven to be a pain-point in more traditional frameworks, so we've worked on making state front-and-center in Mise.

Every component takes an initial state as one of the required parameters

```javascript
import { dom, component } from '@mise/core';

component({
  template:
    //...
  actions:
    //...
  state: {
    greeting: 'Hello World!',
  },
})
```

State is always an object and accessibly in both templates and actions as a parameter.

#### State is Read-Only.

You can't ever directly modify the state.

```javascript
import { dom, component } from 'mise';
component({
  template:
    //...
  state: {
    id: 0
  },
  actions: {
    // wont actually work!
    increment: state => { state.id++ },
  }
})
```

#### State can _only_ be modified by actions

If you want to modify the state of your application, you can do so via an action. Actions must return a new object which is merged with the current state.

```javascript
import { dom, component } from 'mise';
component({
  template:
    //...
  state: {
    id: 0
  },
  actions: {
    // works!
    increment: state => ({ state.id + 1 }),
  }
})
```

In this example, after using the increment action, the new state is `1`. After setting a new state, the application re-renders and generates a new template.

#### Testing
Since state is directly modified by actions, testing an action and having it return a new state is a sufficiently good test.

```javascript
describe('increment action', () => {
  it('should increment the state by one', () => {
    expect(increment({ id: 0 })).toEqual({ id: 1 });
  })
})
