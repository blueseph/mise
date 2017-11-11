import { vdom } from './vdom';
import { fibers, types } from './fiber';

const reconciler = () => {
  let inProgress = false;
  let workQueue = [];
  let finished = [];
  const { create } = fibers();

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
    const children = fiber.next.children || fiber.previous.children;
    if (children) {
      children.forEach((node, index) => {
        add(create(
          fiber.parent.childNodes[index],
          fiber.previous.children[index],
          fiber.next.children[index],
        ));
      });
    }
  };

  const reconcile = (fiber) => {
    addChildren(fiber);

    if (!fiber.previous || fiber.previous.empty) {
      fiber.action = types.create;
      if (fiber.next.props && fiber.next.props.oncreate) {
        fiber.lifecycle = fiber.next.props.oncreate;
      }

      return fiber;
    }

    if (!fiber.next || fiber.next.empty) {
      fiber.action = types.remove;
      if (fiber.previous.props && fiber.previous.props.onremove) {
        fiber.lifecycle = fiber.previous.props.onremove;
      }

      return fiber;
    }

    if (shouldReplace(fiber.previous, fiber.next)) {
      fiber.action = types.replace;
      if (fiber.next.props && fiber.next.props.onupdate) {
        fiber.lifecycle = fiber.next.props.onupdate;
      }

      return fiber;
    }

    fiber.action = types.update;
    if (fiber.next.props && fiber.next.props.onupdate) {
      fiber.lifecycle = fiber.next.props.onupdate;
    }

    return fiber;
  };

  const work = (deadline) => {
    while (deadline.timeRemaining() && workQueue.length) {
      const completed = reconcile(next());
      finished = [...finished, completed];
    }
  };

  const process = (deadline) => {
    work(deadline);

    if (workQueue.length) {
      requestIdleCallback(process);
    } else {
      inProgress = false;
      requestAnimationFrame(vdom.paint.bind(null, finished));
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
