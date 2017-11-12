import { fibers, types } from './fiber';

const reconciler = (paint) => {
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
    const prevChildren = fiber.previous.children || [];
    const nextChildren = fiber.next.children || [];
    const length = Math.max(prevChildren.length, nextChildren.length);

    for (let i = 0; i < length; i += 1) {
      add(create(
        fiber.element,
        fiber.parent.childNodes[i],
        fiber.previous.children[i],
        fiber.next.children[i],
      ));
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
      try {
        const completed = reconcile(next());
        finished = [...finished, completed];
      } catch (ex) {
        console.log(ex);
      }
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
