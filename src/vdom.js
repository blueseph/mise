const vdom = () => {
  const updateDOM = (parent, original, updated) => {
    const itemsToRemove = [];

    update(parent, parent.childNodes[0], original, updated, itemsToRemove);

    for (const item of itemsToRemove) {
      item.remove();
    }
  };

  const update = (parent, element, original, updated, itemsToRemove) => {
    diff(parent, element, original, updated, itemsToRemove);

    if ((updated && updated.children) && (original && original.children)) {
      const maxChildren = Math.max(
        original.children.length,
        updated.children.length
      );

      for (let i = 0; i < maxChildren; i++) {
        update(
          element,
          (element && element.childNodes[i]) || undefined,
          original.children[i],
          updated.children[i],
          itemsToRemove
        );
      }
    }
  };

  const diff = (parent, element, original, updated, itemsToRemove) => {
    if (!original)
      parent.appendChild(
        createElement(updated)
      );
    else if (!updated)
      itemsToRemove.push(element); // :puke:
    else if (shouldReplace(original, updated))
      parent.replaceChild(
        createElement(updated),
        element
      );
    else
      updateProps(
        element,
        original.props,
        updated.props
      );
  };

  const createElement = (node) => {
    if (typeof node === 'string')
      return document.createTextNode(node);

    const { type, props, children } = node;
    const element = document.createElement(type);
    setProps(element, props);

    children
      .map(createElement)
      .forEach(child => element.appendChild(child));

    return element;
  };

  const shouldReplace = (original, updated) =>
    typeof original !== typeof updated ||
    (typeof original === 'string' && original !== updated) ||
    original.type !== updated.type;

  const updateProps = (element, original = {}, updated = {}) => {
    const props = new Set(Object.keys(original), Object.keys(updated));

    for (const prop of props) {
      setProp(element, prop, original[prop], updated[prop]);
    }
  };

  const setProps = (element, props) => {
    for (let [attribute, value] of Object.entries(props)) {
      setProp(element, attribute, {}, value);
    }
  };

  const setProp = (element, attribute, original, updated) => {
    if (attribute === 'value') {
      if (updated || updated === 0 || updated === '')
        element[attribute] = updated;
      return;
    }

    if (typeof updated === 'boolean'){
      if (updated) {
        element.setAttribute(attribute, updated);
        element[attribute] = updated;
      }
      return;
    }

    if (typeof updated === 'function') {
      element[attribute] = updated;
      return;
    }

    if (attribute === 'value') {
      if (updated || updated === 0 || updated === '')
        element[attribute] = updated;
      return;
    }

    if (!updated || (typeof updated === 'object' && !Object.keys(updated).length)) {
      element.removeAttribute(attribute);
      return;
    }

    if (attribute === 'style') {
      const styles = new Set(Object.keys(updated), Object.keys(original));

      for (const style of styles) {
        if (!updated[style])
          element.style[style] = '';
        else if (!original[style] || original[style] !== updated[style]){
          element.style[style] = updated[style];
        }
      }

      return;
    }

    element.setAttribute(attribute, updated);
  };

  return {
    createElement,
    updateDOM,
  };
};

export { vdom };
