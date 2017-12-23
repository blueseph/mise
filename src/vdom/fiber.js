import { createElement } from './vdom';

const types = {
  create: 'CREATE',
  remove: 'REMOVE',
  replace: 'REPLACE',
  update: 'UPDATE',
  skip: 'SKIP',
};

const create = ({
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

export { create, types };
