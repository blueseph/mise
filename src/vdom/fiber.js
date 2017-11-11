const types = {
  create: 'CREATE',
  remove: 'REMOVE',
  replace: 'REPLACE',
  update: 'UPDATE',
};

const fibers = () => {
  const empty = () => ({
    children: [],
    empty: true,
  });

  const create = (parent, element, previous = empty(), next = empty()) => ({
    parent,
    element,
    type: next.type,
    previous: previous || empty(),
    next: next || empty(),
  });

  return {
    create,
  };
};

export { fibers, types };
