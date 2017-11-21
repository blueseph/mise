# 3.0.0 - Fiber

Mise's architecture now supports asynchronous rendering. What's asynchronous rendering?

#### The problem

In VDOM implementations, there's two phases. There's the reconciliation phase where the VDOM engine figures out what changed, and the rendering phase where the DOM is changed to match what should exist.

Browsers try and update themselves roughly every 16ms to achieve 60 fps. There's a little bit of housekeeping to be done, so you'd roughly get around 10ms to complete any work that needs to be done. Browsers are also single threaded. If you *don't* complete your work in the allotted timeframe, your framerate drops and there's a little bit of jank. Generally, a little jank isn't a problem.

The problem lies in the fact that given a big enough template, Mise would *significantly* overrun its budget. Adding a thousand items would cause a tremendously noticeable amount of slowdown and it would feel as if the browser froze. Even though this is technically the fastest implementation, it felt slow.

#### The solution

Mise now splits the reconcilation phase and the rendering phase. 

Modern browsers provide a function that allows you to yield back the main thread to the browser every so often so that it gets to complete the work required to maintain 60 fps. By leveraging this API, Mise ensures that the reconcilation phase doesn't gobble up the main thread for too long.

The rendering phase remains mostly unchanged. The browser itself provides an API to request an animation frame to render any changes.

#### What does this mean to me?

Mise now renders asyncronously. The first render for Mise used to be completely synchronous and would immediately be available for testing. The new architecture means you have to wait for the first render to occur. This likely means your tests will break. Your application will continue to work.

