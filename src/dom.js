const dom = (type, props = {}, ...uncheckedChildren) => {
  let children = [];
  for (const child of uncheckedChildren) {
    children = [ ... children, typeof child === 'number' ? String(child) : child];
  }

  return { type, props, children };
};

export default dom;
