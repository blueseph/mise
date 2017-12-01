# Lifecycle

Mise supports middleware that fire right as an update is going to occur. Mise supports Express/Koa/Redux style middleware where each composable and pure.

```js
const logger = previous => action => next => (data) => {
  console.log({ previous });
  console.log({ action });
  console.log({ data });

  const partial = next(data);

  console.log({ partial });
};

component({
    //...
    middleware: [ logger ],
})
```

Mise relies on you passing `data` to the `next` function. Once you do, the next middleware will run, so and on and so forth until finally the intended action runs and returns the result all the way back up the chain. Once the chain of middlewares finishes, the result is returned to Mise and an update triggers.

Here's the function signature of a middleware explained in depth

```js
const uselessMiddleware =
  previous => /* this is your previous state. this doesn't reflect any                     changes made by this update yet */
  action => /* this is the name of your action. if you actions look like {
                  increment: () => {},
                  decrement: () => {},
                }, and you use the increment function, a string of 'increment' will be passed. */
  next => /*  the next function in the middleware chain, ending with 
              your action */
  data => /*  the data that was passed to your action. any events or added                data go here */
  {
    /* this could either be the updated state or it could be a function in the case of thunks. */
    const partial = next(data); 

    return partial;
  }
```