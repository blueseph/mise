const dom = (type, uncheckedProps = {}, ...uncheckedChildren) => {
  let children = [];
  let props = uncheckedProps;

  for (const child of uncheckedChildren) {
    if (Array.isArray(child)) {
      children = [...children, ...child.filter(child => Boolean(child))];
    } else {
      if (child !== null) {
        children = [...children, typeof child === 'number' ? String(child) : child];
      }
    }
  }

  if (uncheckedProps === null) { props = {}; }

  if (typeof type === 'function') {
    return type(props, children);
  }

  return { type, props, children };
};

export { dom };
