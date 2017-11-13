import { getUniques } from '../utils';
import { types } from './fiber';

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

const updateProps = (element, previous, next) => {
  const props = getUniques(previous, next);

  for (const prop of props) {
    setProp(element, prop, previous[prop], next[prop]);
  }
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
          lifecycle(next.element)(previous.element.remove);
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

        updateProps(previous.element, previous.tree.props, next.tree.props);

        break;
      }

      default: {
        return;
      }
    }
  }
};

export { paint, createElement };
