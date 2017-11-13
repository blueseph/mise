const types = {
  create: 'CREATE',
  remove: 'REMOVE',
  replace: 'REPLACE',
  update: 'UPDATE',
};

const empty = () => ({
  children: [],
  empty: true,
});

const create = ({
  parent,
  element = null,
  previous = empty(),
  next = empty(),
}) => ({
  parent,
  previous: {
    tree: previous,
    element,
  },
  next: {
    tree: next,
    element: null,
  },
});

export { create, types };
