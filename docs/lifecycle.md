# Lifecycle

Mise uses a handful of lifecycle methods to allow you fine-grain control of your elements.

### `oncreate`

The `oncreate` function returns the newly created element.

```javascript
component({
  template: state => actions => (
    <div>
      <span
        oncreate={el => actions.hydrate(el)}
    </div>
  ),
  state: {
    // ..
  },
  actions: {
    hydrate: (state, actions, el) => {
      // ...
    }
  }
});
```

### `onremove`

`onremove` returns a curried function, one containing the actual element and the other containing a `done` function. Once you've finished your business with `onremove`, call `done` to actually remove it from the dom;

```javascript
import { removalAnimation } from './animations';

component({
  template: state => actions => (
    <div>
      <span
        onremove={
          el => done =>
            el.animate([
              removalAnimation
            ], 2000);

            setTimeout(done, 2000)
      }
    </div>
  ),
});
```

### `onupdate`

`onupdate` is tricky. Mise calls `onupdate` anytime your element is either set to be replaced or if the props are going to be diffed. Since we can't know if any props have changed until we go through all the props, we'd rather let you know this is coming. To faciliate any change, we'll also pass you the old props so you can determine if you want to run your update.

```javascript
component({
  template: state => actions => (
    <div>
      <span
        onupdate={
          el => oldProps => {
            if (oldProps.TTL < state.TTL) {
              actions.updateTTL(state.TTL);
            }
          }
        }
      >
      {state.TTL}
      </span>
    </div>
  ),
});
```
