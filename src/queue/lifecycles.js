export const recurseLifecycles = (
  element,
  tree,
  lifecycle,
) => {
  if (typeof tree === 'object') {
    tree.props?.[lifecycle]?.(element);

    if (element.children?.length) {
      Array.from(element.children)
        .filter(child => child)
        .forEach((child, i) => recurseLifecycles(child, tree.children[i], lifecycle));
    }
  }
};
