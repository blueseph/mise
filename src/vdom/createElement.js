import { getUniques } from '../utils';

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
      element[attribute] = next || '';
    } catch (ex) {
      /* sometimes mise lifecycle methods throw. we dont care */
    }

    if (typeof next !== 'function' && attribute !== 'value' && attribute !== 'boolean' && next) {
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
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }

  const { type, props, children } = node;
  const element = document.createElement(type);
  setProps(element, {}, props);

  children
    .map(createElement)
    .forEach(child => element.appendChild(child));

  return element;
};

export { setProps, createElement };
