import { createElement } from '../vdom';

export const types = {
  create: 'CREATE',
  remove: 'REMOVE',
  replace: 'REPLACE',
  update: 'UPDATE',
};

export const create = ({
  parent,
  element = null,
  previous = null,
  next = null,
}) => ({
  parent,
  previous: {
    tree: previous,
    element,
  },
  next: {
    tree: next,
    element: next !== null ? createElement(next) : next,
  },
});
