/* TODO: nullish coalescing when babel-eslint supports it */
export const getUniques = (first, second) => new Set([
  ...Object.keys(first || {}),
  ...Object.keys(second || {}),
]);

export const compose = (...fns) => {
  if (!fns || !fns.length) {
    return x => x;
  }

  if (fns.length === 1) {
    return fns[0];
  }

  return fns.reduce((composed, fn) => (...args) => composed(fn(...args)));
};

export const makeCopy = item => (Array.isArray(item) ? [...item] : { ...item });

export const compareObjects = (
  first = {},
  second = {},
  keys = [...getUniques(first, second)],
) => keys.reduce((diff, key) => {
  if (!first[key]) return { ...diff, add: { ...diff.add, [key]: second[key] } };
  if (!second[key]) return { ...diff, remove: { ...diff.remove, [key]: first[key] } };
  if (first[key] !== second[key]) {
    return { ...diff, update: { ...diff.update, [key]: second[key] } };
  }
  return diff;
}, { add: {}, remove: {}, update: {} });

export const isEmpty = (obj = {}) => Object.keys(obj).every(key => !Object.keys(obj[key]).length);
