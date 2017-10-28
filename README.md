# Mise (_en place_)

[Mise](https://en.wikipedia.org/wiki/Mise_en_place) is a fully-featured front-end application library with built-in state management. Mise uses component-based architecture to promote [constructing elegant hierarchies for maximum code reuse and extensibility](http://siliconvalleyism.com/silicon-valley-quote.php?id=206). By explicitly manipulating your state _only_ via actions, code paths are clearly defined and change in predictable ways. Applications lend themselves to being highly and rigorously testable.

Mise has zero dependencies and strives for performance.

* VDOM managed updates for fast rendering.
* Easy state-management.
* Highly testable.
* Minimal (2.25kb minified, 1028 bytes gzipped)

#### Installation (coming soon)
```
npm i mise
```

In your actual project

```javascript
import { dom, mise } from 'mise';
```

Or, if you prefer to use umd

```javascript
<script async src="https://unpkg.com/mise"></script>
<script type="javascript">
  const { dom, component } = mise;
</script>
```

##### Example
```javascript
/** @jsx dom */

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

Wanna avoid having to use `/** @jsx dom */` everywhere? Add the `transform-react-jsx` plugin to your webpack config.

```javascript
{
  "plugins": {
    [
      "transform-react-jsx", {
        "pragma": "dom",
      }
    ]
  }
}
```

You'll still have to `import dom` just like you would `import React`.
