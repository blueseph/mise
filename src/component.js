import { vdom } from './vdom';

const component = ({
  template, state, actions, root = document.body,
}) => {
  const VDOM = vdom();
  let appState;
  let appTemplate;
  let appActions;

  const generateTemplate = unsafeState => (unsafeActions) => {
    const readOnlyState = { ...unsafeState };
    const readOnlyActions = { ...unsafeActions };

    return template(readOnlyState)(readOnlyActions);
  };

  const render = () => {
    const oldTemplate = appTemplate;
    appTemplate = generateTemplate(appState)(appActions);

    VDOM.update(root, root.childNodes[0], oldTemplate, appTemplate);
  };

  const requestRender = () => {
    requestAnimationFrame(render);
  };

  const update = (partialState) => {
    appState = {
      ...appState,
      ...partialState,
    };

    requestRender();
  };

  const bindUpdateToActions = (unboundActions) => {
    const tempActions = {};

    for (const [key, fn] of Object.entries(unboundActions)) {
      tempActions[key] = (data) => {
        const result = fn(appState, appActions, data);

        if (typeof result === 'function') {
          result(update);
        } else {
          update(result);
        }
      };
    }

    return tempActions;
  };

  const init = (initialActions) => {
    appState = state;
    appActions = bindUpdateToActions(initialActions);
    appTemplate = generateTemplate(appState)(appActions);

    root.appendChild(VDOM.createElement(appTemplate));
  };

  init(actions);
};

export { component };
