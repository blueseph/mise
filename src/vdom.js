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

  const update = (parent, original, updated, index = 0) => {
    if (!original)
      parent.appendChild(createElement(updated));
    else if (!updated)
      parent.removeChild(parent.childNodes[index]);
    else
      if (shouldReplace(original, updated))
        parent.replaceChild(
          createElement(updated),
          parent.childNodes[index]
        );
      else
        updateProps(
          parent.childNodes[index],
          original.props,
          updated.props
        );

    if (updated && updated.type && original && original.type) {
      const length = Math.max((original.children && original.children.length) || 0, (updated.children && updated.children.length) || 0);

      for (let i = 0; i < length; i++) {
        update(
          parent.childNodes[index],
          original.children[i],
          updated.children[i],
          i
        );
      }
    }
  };

  const shouldReplace = (original, updated) =>
    typeof original !== typeof updated ||
    (typeof original === 'string' && original !== updated) ||
    original.type !== updated.type;

  const updateProps = (element, original = {}, updated = {}) => {
    const props = new Set(Object.keys(original), Object.keys(updated));

    for (const prop of props) {
      if (!original[prop])
        addProp(element, prop, updated[prop]);
      else if (!updated[prop])
        removeProp(element, prop, original[prop]);
    }
  };

  const setProps = (element, props) => {
    if (props && Object.keys(props)) {
      for (let [attribute, value] of Object.entries(props)) {
        addProp(element, attribute, value);
      }
    }
  };

  const handleSpecialProps = (element, attribute, value) => {
    if (attribute === 'className') {
      element.setAttribute('class', value);
      return false;
    } else if (typeof value === 'boolean'){
      if (value) {
        element.setAttribute(attribute, value);
        element[attribute] = value;
      }
      return false;
    } else if (typeof value === 'function') {
      element[attribute] = value;
      return false;
    }

    return true;
  };

  const addProp = (element, attribute, value) => {
    const standardProp = handleSpecialProps(element, attribute, value);
    if (standardProp)
      element.setAttribute(attribute, value);
  };

  const removeProp = (element, attribute, value) => {
    element.removeAttribute(attribute === 'className' ? 'class' : attribute , value);
  };

  return {
    createElement,
    update,
  };
};

export { vdom };
