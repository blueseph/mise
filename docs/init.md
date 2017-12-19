# Initialization Functions

Initialization functions provide you a gateway to bootstrap your app before it gets rendered. You can attach actions to events, kick off a service worker, or even fetch data before your app renders. Init **only** triggers a re-render when an action occurs.

```js
const init = state => (actions) => {
  actions.fetchData();

  document.addEventListener('dragstart', () => {
    // ...
  });
};
```