const typeError = 'dom was called with an undefined type. Did you forget to define something?';
const invalidFunctionValue = name => `${name} was called and returned undefined. Are you sure it's defined properly?`;

const dom = (type, uncheckedProps = {}, ...uncheckedChildren) => {
  if (!type) throw new Error(typeError);

  let children = [];
  let props = uncheckedProps;

  for (const child of uncheckedChildren) {
    if (Array.isArray(child)) {
      children = [...children, ...child.filter(node => Boolean(node))];
    } else if (child !== null) {
      children = [...children, typeof child === 'number' ? String(child) : child];
    }
  }

  /* TODO: nullish coalescing when babel-eslint supports it */
  if (uncheckedProps === null) { props = {}; }

  if (typeof type === 'function') {
    const templateValue = type(props, children);

    if (templateValue === undefined) throw new Error(invalidFunctionValue(type.name));
    return type(props, children);
  }

  return { type, props, children };
};

export { dom };
