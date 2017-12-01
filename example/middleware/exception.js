import { Raven } from './raven';

const exception = () => () => next => (data) => {
  let partial;

  try {
    partial = next(data);
  } catch (ex) {
    Raven.captureException(ex);
  }

  return partial;
};

export { exception };
