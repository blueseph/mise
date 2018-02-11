export const shouldReplace = (previous, next) =>
  typeof previous !== typeof next ||
  (typeof previous === 'string' && previous !== next) ||
  previous.type !== next.type;
