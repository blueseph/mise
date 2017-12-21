import { create, types } from './fiber';
import { createElement, paint } from './vdom';

const reconciler = () => {
  let inProgress = false;
  let workQueue = [];
  let finished = [];

  const next = () => {
    const [item, ...rest] = workQueue;
    workQueue = rest;
    return item;
  };

  const shouldReplace = (previous, updated) =>
    typeof previous !== typeof updated ||
    (typeof previous === 'string' && previous !== updated) ||
    previous.type !== updated.type;

  const addChildren = (fiber) => {
    const prevChildren = (fiber.previous.tree && fiber.previous.tree.children) || [];
    const nextChildren = (fiber.next.tree && fiber.next.tree.children) || [];
    const length = Math.max(prevChildren.length, nextChildren.length);

    if (fiber.previous.element) {
      for (let i = 0; i < length; i += 1) {
        const newFiber = create({
          parent: fiber.previous.element,
          element: (fiber.previous.element && fiber.previous.element.childNodes[i]) || null,
          previous: prevChildren[i],
          next: nextChildren[i],
        });

        // eslint-disable-next-line no-use-before-define
        add(newFiber);
      }
    }
  };

  const reconcile = (fiber) => {
    if (!fiber || (!fiber.previous.tree && fiber.next.tree === null)) {
      fiber.action = types.skip;
      return fiber;
    }

    addChildren(fiber);

    if (!fiber.previous.tree || fiber.previous.tree.empty) {
      fiber.action = types.create;
      fiber.next.element = createElement(fiber.next.tree);

      if (fiber.next.tree.props && fiber.next.tree.props.oncreate) {
        fiber.lifecycle = fiber.next.tree.props.oncreate;
      }

      return fiber;
    }

    if (!fiber.next.tree || fiber.next.tree.empty) {
      fiber.action = types.remove;
      if (fiber.previous.tree.props && fiber.previous.tree.props.onremove) {
        fiber.lifecycle = fiber.previous.tree.props.onremove;
      }

      return fiber;
    }

    if (shouldReplace(fiber.previous.tree, fiber.next.tree)) {
      fiber.action = types.replace;
      fiber.next.element = createElement(fiber.next.tree);

      if (fiber.next.tree.props && fiber.next.tree.props.onupdate) {
        fiber.lifecycle = fiber.next.tree.props.onupdate;
      }

      return fiber;
    }

    fiber.action = types.update;
    if (fiber.next.tree.props && fiber.next.tree.props.onupdate) {
      fiber.lifecycle = fiber.next.tree.props.onupdate;
    }

    return fiber;
  };

  const work = (deadline) => {
    while (deadline.timeRemaining() && workQueue.length) {
      const completed = reconcile(next());
      // don't add null elements like null routes to the finished queue for painting.
      if (completed.action !== types.skip) finished = [...finished, completed];
    }
  };

  const process = (deadline) => {
    work(deadline);

    if (workQueue.length) {
      requestIdleCallback(process);
    } else {
      inProgress = false;

      const boundPaint = paint.bind(null, finished);
      requestAnimationFrame(boundPaint);

      finished = [];
    }
  };

  const add = (fiber) => {
    workQueue = [...workQueue, fiber];

    if (!inProgress) {
      inProgress = true;
      requestIdleCallback(process);
    }
  };

  return {
    add,
  };
};

export { reconciler };
