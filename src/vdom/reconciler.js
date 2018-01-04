import { create, types } from './fiber';
import { paint } from './vdom';

const shouldReplace = (previous, updated) =>
  typeof previous !== typeof updated ||
  (typeof previous === 'string' && previous !== updated) ||
  previous.type !== updated.type;

const getFiberizedChildren = (fiber) => {
  let children = [];
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

      children = [...children, newFiber];
    }
  }

  return children;
};

const reconcile = (original) => {
  const fiber = { ...original };

  if (fiber.previous.tree === null && fiber.next.tree === null) {
    fiber.action = types.skip;

    return fiber;
  }

  if (!fiber.previous.tree) {
    fiber.action = types.create;
    if (fiber.next.tree.props && fiber.next.tree.props.oncreate) {
      fiber.lifecycle = fiber.next.tree.props.oncreate;
    }

    return fiber;
  }

  if (!fiber.next.tree) {
    fiber.action = types.remove;

    if (fiber.previous.tree.props && fiber.previous.tree.props.onremove) {
      fiber.lifecycle = fiber.previous.tree.props.onremove;
    }

    return fiber;
  }

  if (shouldReplace(fiber.previous.tree, fiber.next.tree)) {
    fiber.action = types.replace;

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

const reconciler = () => {
  let inProgress = false;
  let workQueue = [];
  let finished = [];

  const next = () => {
    const [item, ...rest] = workQueue;
    workQueue = rest;
    return item;
  };

  const work = (deadline) => {
    while (deadline.timeRemaining() && workQueue.length) {
      const fiber = next();
      const completed = reconcile(fiber);

      if (completed.action !== types.skip) {
        const children = getFiberizedChildren(fiber);

        if (children.length) {
          // eslint-disable-next-line no-use-before-define
          children.forEach(add);
        }

        finished = [...finished, completed];
      }
    }
  };

  const exhaustQueue = (deadline) => {
    work(deadline);

    if (workQueue.length) {
      requestIdleCallback(exhaustQueue);
    } else {
      inProgress = false;

      const currentQueue = [...finished];

      requestAnimationFrame(() => paint(currentQueue));

      finished = [];
    }
  };

  const add = (fiber) => {
    workQueue = [...workQueue, fiber];

    if (!inProgress) {
      inProgress = true;
      requestIdleCallback(exhaustQueue);
    }
  };

  return {
    add,
  };
};

export { reconciler };
