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

  const create = (element, previous = empty(), next = empty()) => ({
    element,
    type: next.type,
    parent: element.parentElement,
    previous: previous || empty(),
    next: next || empty(),
  });

  return {
    create,
  };
};

export { fibers, types };
