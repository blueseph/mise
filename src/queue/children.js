import { create } from './fiber';

export const getFiberizedChildren = (fiber) => {
  let children = [];
  const prevChildren = fiber.previous.tree?.children || [];
  const nextChildren = fiber.next.tree?.children || [];
  const length = Math.max(prevChildren.length, nextChildren.length);

  if (fiber.previous.element && fiber.previous.element.nodeType !== Node.TEXT_NODE) {
    for (let i = 0; i < length; i += 1) {
      const parent = fiber.previous.element;
      const element = fiber.previous.element?.childNodes[i];
      const previous = prevChildren[i];
      const next = nextChildren[i];

      const newFiber = create({
        parent,
        element,
        previous,
        next,
      });

      children = [...children, newFiber];
    }
  }

  return children;
};
