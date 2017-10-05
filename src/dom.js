const dom = (type, uncheckedProps = {}, ...uncheckedChildren) => {
  let children = [];
  let props = uncheckedProps;
  for (const child of uncheckedChildren) {
    children = [ ... children, typeof child === 'number' ? String(child) : child];
  }

  if (uncheckedProps === null)
    props = undefined;

  return { type, props, children };
};

export default dom;
