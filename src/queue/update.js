export const shouldUpdate = (previous, next) => typeof previous === typeof next
  && typeof previous !== 'string';
