import { getUniques } from '../utils';
import { types } from './fiber';

const vdom = () => {
  const setProp = (element, attribute, previous, next) => {
    if (attribute === 'value') {
      if (next || next === 0 || next === '') {
        element[attribute] = next;
      }
      return;
    }

    if (typeof next === 'boolean') {
      if (next) {
        element.setAttribute(attribute, next);
        element[attribute] = next;
      }
      return;
    }

    if (typeof next === 'function') {
      try {
        element[attribute] = next;
      } catch (e) {
        /* sometimes lifecycle methods throw. we don't particularly care */
      }

      return;
    }

    if (!next || (typeof next === 'object' && !Object.keys(next).length)) {
      element.removeAttribute(attribute);
      return;
    }

    if (attribute === 'style') {
      const styles = getUniques(next, previous);

      for (const style of styles) {
        if (!next[style]) {
          element.style[style] = '';
        } else if (!previous || !previous[style] || previous[style] !== next[style]) {
          element.style[style] = next[style];
        }
      }

      return;
    }

    element.setAttribute(attribute, next);
  };

  const setProps = (element, props) => {
    for (const [attribute, value] of Object.entries(props)) {
      setProp(element, attribute, {}, value);
    }
  };

  const createElement = (node) => {
    if (typeof node === 'string') {
      return document.createTextNode(node);
    }

    const { type, props, children } = node;
    const element = document.createElement(type);
    setProps(element, props);

    children
      .map(createElement)
      .forEach(child => element.appendChild(child));

    return element;
  };

  const shouldReplace = (previous, next) =>
    typeof previous !== typeof next ||
    (typeof previous === 'string' && previous !== next) ||
    previous.type !== next.type;

  const updateProps = (element, previous, next) => {
    const props = getUniques(previous, next);

    for (const prop of props) {
      setProp(element, prop, previous[prop], next[prop]);
    }
  };

  const paint = (fibers) => {
    for (const fiber of fibers) {
      switch (fiber.action) {
        case (types.create): {
          const element = createElement(fiber.next);

          fiber.parent.appendChild(element);
          if (fiber.lifecycle) {
            fiber.lifecycle(element);
          }

          break;
        }

        case (types.remove): {
          if (fiber.lifecycle) {
            fiber.lifecycle(fiber.element)(fiber.element.remove);
          } else {
            fiber.element.remove();
          }

          break;
        }

        case (types.replace): {
          const element = createElement(fiber.next);

          if (fiber.lifecycle) {
            fiber.lifecycle(element)(fiber.previous.props);
          }

          fiber.parent.replaceChild(
            element,
            fiber.element,
          );

          break;
        }

        case (types.update): {
          if (fiber.lifecycle) {
            fiber.lifecycle(fiber.element)(fiber.previous.props);
          }

          updateProps(fiber.element, fiber.previous.props, fiber.next.props);

          break;
        }

        default: {
          return;
        }
      }
    }
  };

  return {
    createElement,
    paint,
  };
};

export { vdom };
