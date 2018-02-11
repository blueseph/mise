import { types } from './fiber';
import { reconcile, compareAttributes } from '../vdom';
import { shouldReplace } from './replace';
import { shouldUpdate } from './update';
import { getFiberizedChildren } from './children';
import { recurseLifecycles } from './lifecycles';
import { isEmpty } from '../utils';

export const diff = (original) => {
  const fiber = { ...original };

  if (!fiber.previous.tree && !fiber.next.tree) return null;

  if (!fiber.previous.tree) {
    recurseLifecycles(fiber.next.element, fiber.next.tree, 'oncreate');
    fiber.action = types.create;

    return fiber;
  }

  if (!fiber.next.tree) {
    recurseLifecycles(fiber.previous.element, fiber.previous.tree, 'onremove');
    fiber.action = types.remove;

    return fiber;
  }

  if (shouldReplace(fiber.previous.tree, fiber.next.tree)) {
    fiber.action = types.replace;
    fiber.next.tree.props?.onupdate?.(fiber.next.element)(fiber.previous.tree.props);

    return fiber;
  }

  if (shouldUpdate(fiber.previous.tree, fiber.next.tree)) {
    const differences = compareAttributes(fiber.previous.tree.props, fiber.next.tree.props);
    const { attributes, styles } = differences;

    if (
      !isEmpty(attributes) ||
      !isEmpty(styles?.add)
    ) {
      fiber.action = types.update;
      fiber.differences = differences;
      fiber.next.tree.props?.onupdate?.(fiber.next.element)(fiber.previous.tree.props);

      return fiber;
    }
  }

  return null;
};

export const createDiff = () => {
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
      const children = getFiberizedChildren(fiber);

      // eslint-disable-next-line no-use-before-define
      children.forEach(add);

      const completed = diff(fiber);
      if (completed) finished = [...finished, completed];
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
