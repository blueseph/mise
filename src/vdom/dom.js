import { compareObjects, getUniques } from '../utils';

export const setProp = (element, attribute, value) => {
  try {
    element[attribute] = value;
  } catch (ex) {
    /* sometimes mise lifecycle methods throw. we dont care */
  }

  if (
    typeof value !== 'function'
    && attribute !== 'value'
    && attribute !== 'boolean'
    && value
  ) {
    element.setAttribute(attribute, value);
  }
};

export const removeProp = (element, attribute) => {
  element.removeAttribute(attribute);
};

export const setAttributes = (element, attributes) => {
  for (const [attribute, value] of Object.entries(attributes.add)) {
    setProp(element, attribute, value);
  }

  for (const [attribute] of Object.entries(attributes.remove)) {
    removeProp(element, attribute);
  }

  for (const [attribute, value] of Object.entries(attributes.update)) {
    setProp(element, attribute, value);
  }
};

const setStyles = (element, styles) => {
  for (const [style] of Object.entries(styles.remove)) {
    element.style[style] = '';
  }

  for (const [style, value] of Object.entries(styles.add)) {
    element.style[style] = value;
  }

  for (const [style, value] of Object.entries(styles.update)) {
    element.style[style] = value;
  }
};

export const setProps = (element, { attributes, styles }) => {
  setAttributes(element, attributes);
  if (styles) setStyles(element, styles);
};

export const compareAttributes = (first, second) => {
  const uniques = getUniques(first, second);
  let styles;

  if (uniques.has('style')) {
    uniques.delete('style');
    styles = compareObjects(first.style, second.style);
  }

  const attributes = compareObjects(first, second, [...uniques]);

  return {
    attributes,
    styles,
  };
};

export const createSVGNode = node => document.createElementNS(
  'http://www.w3.org/2000/svg',
  node.nodeName,
);

export const createElement = (node) => {
  if (typeof node === 'string') return document.createTextNode(node);

  const { type, props, children } = node;
  const element = node.nodeName !== 'svg'
    ? document.createElement(type) : createSVGNode(node);
  setProps(element, compareAttributes({}, props));

  children
    .map(createElement)
    .forEach(child => element.appendChild(child));

  return element;
};
