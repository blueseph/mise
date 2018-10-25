# Templates

Mise templates are simple affairs. Primary templates are curried functions that accept state and actions as parameters and return a JSX representation of what your UI looks like. Generally, you only have one primary template.

```javascript
const template = state => actions => (
  <h1>{state.greeting}</h1>
)
```

Secondary templates (i.e. templates that aren't at the root level) are functions that accept props and children as their parameters.

```javascript
const secondary = (props, children) => {
    <li class={props.class}>
      <div>{children}</div>
    </li>
}
```

#### All templates in Mise are presentational templates.
Templates don't contain actual logic in them. They instead contain references to functions that contain the actual logic. The closest a template will get to logic is to pass in parameters that a function will need.

```javascript
const template => state => actions => (
  <div id="click-counter">
    <span>{state.clicked}</span>
    <button onclick={actions.increment}>Click me!</span>
    <button onclick={e => actions.reset(e)}>Reset</span>
  </div>
)
```

#### Templates in Mise are composable

```javascript
const template = state => actions => (
  <div id="todos">
    <h1>Todos!</h1>
    <ul>
      {state.todos.map(todo =>
        <TodoItem
          id={todo.id}
          text={todo.text}
          complete={actions.complete}
          remove={actions.remove} />
      )}
    </ul>
  </div>
)

const TodoItem = ({
    id,
    text,
    complete,
    remove
}) => (
  <li>
    <span onclick={() => complete(id)}>
      {todo.text}
    </span>
    <button onclick={() => remove(id)}>
      x
    </button>
  </li>
)
```

By composing templates, we can keep items compartmentalized and easy to test. This also reduces the cognative load of onboarding a new developer - it's easy to see the hierarchy.

#### Context

`Prop drilling`, or passing down props through unrelated templates, muddies up what should be a clean hierarchy. If enough items need to be passed down, it gets tempting to pass down all the props all the time, making it difficult to know what exists in them.

```javascript
import { dom } from '@mise/core';
import { Product } from './src/templates/blog';
import { CheckoutCart } from './src/templates/shop';

const App = state => actions => (
  <main>
    <Shop state={state.shop} actions={actions} />
    <Blog state={state.blog} actions={actions} />
  </main>
)
```

App never actually needed to know about `state` or `actions`, but it did need to pass these to secondary templates. Given a long enough chain of secondary templates, unrelated props get passed down through templates that don't care about them.
With context, you can specifically request `state`, `actions`, or a slice of the `state` on demand and avoid prop drilling.

```javascript
import { dom } from '@mise/core';
import { Product } from './src/templates/products';
import { CheckoutCart } from './src/templates/checkout-cart';

const App = state => actions => (
  <div>
    <Shop />
    <Blog />
  </div>
)

const Shop = () => (
  <main>
    <Products $MiseState={state => state.shop} />
    <Cart $MiseActions />
  </main>
)

const Products = ({ products, specials, tracking, }) => (
  /* ... */
)

const Cart = ({ checkout, applyDiscount, }) => (
  /* ... */
)
```

Our App template never needed to know about any props that didn't relate to it. We can keep our templates clean of any erroneous info that's hard to map mentally.

#### Testing

Since Mise components are all pure functions, testing them is simple. We use Jest and strongly suggest that you use it to test Mise.

```javascript
import { dom } from '@mise/core';

import { template } from './src/todo.template';
import { actions } from './src/todo.actions';
import { state } from './src/todo.state';

describe('template test', () => {
  const { body } = document;
  
  beforeEach(() => {
    body.innerHTML = '';
  })

  it('should render a todo ul', () => {
    /* this is basically what mise does, too! */
    const result = template(state)(actions);

    const expectedResult = (
      <ul>
        <li>Add a Router</li>
        <li>Add a testing suite</li>
      </ul>
    );

    expect(result).toEqual(expectedResult);
  })
})
```
