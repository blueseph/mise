const logger = previous => action => next => (data) => {
  console.log({ previous });
  console.log({ action });
  console.log({ data });

  const partial = next(data);

  console.log({ partial });
};

export { logger };
