const vdom = () => {
  const update = (parent, element, previous, next) => {
    const updated = reconcile(parent, element, previous, next);

    if (updated) {
      const prevChildren = previous.children || [];
      const nextChildren = next.children || [];
      const length = Math.max(prevChildren.length, nextChildren.length);
      const childNodes = [ ... (element && element.childNodes) || [] ];

      for (let i = 0; i < length; i++)
        update(
          element,
          childNodes[i],
          previous.children[i],
          next.children[i]
        );
    }
  };

  const reconcile = (parent, element, previous, next) => {
    if (!previous) {
      const el = createElement(next);
      if (next.props.oncreate)
        next.props.oncreate(el);

      parent.appendChild(el);
      return false;
    }

    if (!next) {
      const remove = () => element.remove();

      if (previous.props && previous.props.onremove) {
        previous.props.onremove(element)(remove);
      } else {
        remove();
      }
      return false;
    }

    if (shouldReplace(previous, next)) {
      const nextElement = createElement(next);

      if (next.props && next.props.onupdate) {
        next.props.onupdate(nextElement)(previous.props);
      }

      parent.replaceChild(
        nextElement,
        element
      );

      return true;
    } else {
      if (next.props && next.props.onupdate) {
        next.props.onupdate(element)(previous.props);
      }

      updateProps(element, previous.props, next.props);
      return true;
    }
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

  const setProps = (element, props) => {
    for (let [attribute, value] of Object.entries(props)) {
      setProp(element, attribute, {}, value);
    }
  };

  const shouldReplace = (original, updated) =>
    typeof original !== typeof updated ||
    (typeof original === 'string' && original !== updated) ||
    original.type !== updated.type;

  const updateProps = (element, original, updated) => {
    const props = new Set();

    for (const key of Object.keys(original)) {
      props.add(key || '');
    }

    for (const key of Object.keys(updated)) {
      props.add(key || '');
    }

    for (const prop of props) {
      setProp(element, prop, original[prop], updated[prop]);
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
      try {
        element[attribute] = updated;
        return;
      } catch (e) {
        return;
      }
    }

    if (!updated || (typeof updated === 'object' && !Object.keys(updated).length)) {
      element.removeAttribute(attribute);
      return;
    }

    if (attribute === 'style') {
      const updatedStyles = updated || {};
      const originalStyles = original || {};
      const styles = new Set(Object.keys(updatedStyles), Object.keys(originalStyles));

      for (const style of styles) {
        if (!updatedStyles[style])
          element.style[style] = '';
        else if (!originalStyles[style] || originalStyles[style] !== updatedStyles[style]){
          element.style[style] = updated[style];
        }
      }

      return;
    }

    element.setAttribute(attribute, updated);
  };

  return {
    createElement,
    update,
  };
};

export { vdom };
