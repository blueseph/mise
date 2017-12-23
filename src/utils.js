const getUniques = (first, second) =>
  new Set([...Object.keys(first || {}), ...Object.keys(second || {})]);

const compose = (...fns) => {
  if (!fns || !fns.length) {
    return x => x;
  }

  if (fns.length === 1) {
    return fns[0];
  }

  return fns.reduce((composed, fn) => (...args) => composed(fn(...args)));
};

const makeCopy = item => (Array.isArray(item) ? [...item] : { ...item });

export { getUniques, compose, makeCopy };
