const vdom = () => {
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

  const update = (parent, element, original, updated, itemsToRemove) => {
    diff(parent, element, original, updated, itemsToRemove);

    if ((updated && updated.children) && (original && original.children)) {
      const maxChildren = Math.max(
        (original && original.children && original.children.length) || 0,
        (updated && updated.children && updated.children.length) || 0
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

  const updateDOM = (parent, original, updated) => {
    const itemsToRemove = [];

    update(parent, parent.childNodes[0], original, updated, itemsToRemove);

    for (const item of itemsToRemove) {
      item.remove();
    }
  };

  const shouldReplace = (original, updated) =>
    typeof original !== typeof updated ||
    (typeof original === 'string' && original !== updated) ||
    original.type !== updated.type;

  const updateProps = (element, original = {}, updated = {}) => {
    const props = new Set(Object.keys(original), Object.keys(updated));

    for (const prop of props) {
      if (!original[prop] || original[props] !== updated[props] || prop === 'style')
        addProp(element, prop, updated[prop]);
      else if (!updated[prop])
        removeProp(element, prop);
    }
  };

  const setProps = (element, props) => {
    if (props && Object.keys(props)) {
      for (let [attribute, value] of Object.entries(props)) {
        addProp(element, attribute, value);
      }
    }
  };

  const addProp = (element, attribute, value) => {
    if (attribute === 'className') {
      element.setAttribute('class', value);
      return;
    } else if (typeof value === 'boolean'){
      if (value) {
        element.setAttribute(attribute, value);
        element[attribute] = value;
      }
      return;
    } else if (typeof value === 'function' || attribute === 'value') {
      if (value !== undefined || value !== null)
        element[attribute] = value;
      return;
    } else if (attribute === 'style') {
      element.removeAttribute(attribute);
      if (value && Object.keys(value).length) {
        for (const [key, val] of Object.entries(value)) {
          element.style[key] = val;
        }
      }
      return;
    }

    element.setAttribute(attribute, value);
  };

  const removeProp = (element, attribute, value) => {
    element.removeAttribute(attribute === 'className' ? 'class' : attribute , value);
  };

  return {
    createElement,
    updateDOM,
  };
};

export { vdom };
