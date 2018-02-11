import { create, types } from './fiber';
import { reconcile } from '../vdom/reconcile';

const shouldReplace = (previous, updated) =>
  typeof previous !== typeof updated ||
  (typeof previous === 'string' && previous !== updated) ||
  previous.type !== updated.type;

const getFiberizedChildren = (fiber) => {
  let children = [];
  const prevChildren = fiber.previous.tree?.children || [];
  const nextChildren = fiber.next.tree?.children || [];
  const length = Math.max(prevChildren.length, nextChildren.length);

  if (fiber.previous.element && fiber.previous.element.nodeType !== Node.TEXT_NODE) {
    for (let i = 0; i < length; i += 1) {
      const newFiber = create({
        parent: fiber.previous.element,
        element: fiber.previous.element?.childNodes[i],
        previous: prevChildren[i],
        next: nextChildren[i],
      });

      children = [...children, newFiber];
    }
  }

  return children;
};

const triggerLifeCycle = (
  element,
  tree,
  lifecycle,
) => {
  if (typeof tree === 'object') {
    tree.props?.[lifecycle]?.(element);

    Array.from(element.children)
      .filter(child => child)
      .forEach((child, i) => triggerLifeCycle(child, tree.children[i], lifecycle));
  }
};

const diff = (original) => {
  const fiber = { ...original };

  if (fiber.previous.tree === null && fiber.next.tree === null) {
    fiber.action = types.skip;

    return fiber;
  }

  if (!fiber.previous.tree) {
    triggerLifeCycle(fiber.next.element, fiber.next.tree, 'oncreate');
    fiber.action = types.create;

    return fiber;
  }

  if (!fiber.next.tree) {
    triggerLifeCycle(fiber.previous.element, fiber.previous.tree, 'onremove');
    fiber.action = types.remove;

    return fiber;
  }

  if (shouldReplace(fiber.previous.tree, fiber.next.tree)) {
    fiber.action = types.replace;
    fiber.next.tree.props?.onupdate?.(fiber.next.element)(fiber.previous.tree.props);

    return fiber;
  }

  fiber.action = types.update;
  fiber.next.tree.props?.onupdate?.(fiber.next.element)(fiber.previous.tree.props);

  return fiber;
};

const createDiff = () => {
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
      const completed = diff(fiber);

      if (completed.action !== types.skip) {
        const children = getFiberizedChildren(fiber);

        // eslint-disable-next-line no-use-before-define
        children.forEach(add);

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

      requestAnimationFrame(() => reconcile(currentQueue));

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

export { createDiff };
