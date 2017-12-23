import { getUniques } from '../utils';
import { types } from './fiber';

const setProp = (element, attribute, previous, next) => {
  if (next === undefined || next === false || (typeof next === 'object' && !Object.keys(next).length)) {
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
  } else {
    try {
      element[attribute] = next;
    } catch (ex) {
      /* sometimes mise lifecycle methods throw when attaching to null elements */
    }

    if (typeof next !== 'function' && attribute !== 'value' && attribute !== 'boolean') {
      element.setAttribute(attribute, next);
    }
  }
};

const setProps = (element, previous, next) => {
  const props = getUniques(previous, next);

  for (const prop of props) {
    setProp(element, prop, previous[prop], next[prop]);
  }
};

const createElement = (node) => {
  if (node === null) return false;

  if (typeof node === 'string') {
    return document.createTextNode(node);
  }

  const { type, props, children } = node;
  const element = document.createElement(type);
  setProps(element, {}, props);

  children
    .map(createElement)
    .forEach(child => child && element.appendChild(child));

  return element;
};

const paint = (fibers) => {
  for (const fiber of fibers) {
    const {
      action,
      next,
      previous,
      lifecycle,
      parent,
    } = fiber;

    switch (action) {
      case (types.create): {
        parent.appendChild(next.element);

        if (lifecycle) {
          lifecycle(next.element);
        }

        break;
      }

      case (types.remove): {
        if (lifecycle) {
          lifecycle(next.element)(previous.element.remove.bind(previous.element));
        } else {
          previous.element.remove();
        }

        break;
      }

      case (types.replace): {
        if (lifecycle) {
          lifecycle(next.element)(previous.props);
        }

        parent.replaceChild(
          next.element,
          previous.element,
        );

        break;
      }

      case (types.update): {
        if (lifecycle) {
          lifecycle(next.element)(previous.props);
        }

        setProps(previous.element, previous.tree.props, next.tree.props);

        break;
      }

      default: {
        return;
      }
    }
  }
};

export { paint, createElement };
