import { vdom } from './vdom';

const component = ({template, state, actions, root = document.body}) => {
  const VDOM = vdom();
  let appState;
  let appTemplate;
  let appActions;

  const bindUpdateToActions = actions => {
    const tempActions = {};

    Object.entries(actions).forEach(([key, fn]) => {
      tempActions[key] = data => {
        const result = fn(appState, appActions, data);

        if (typeof result === 'function')
          result(update);
        else
          update(result);
      };
    });

    return tempActions;
  };

  const update = partialState => {
    appState = Object.assign(
      {},
      appState,
      partialState
    );

    requestRender();
  };

  const render = () => {
    const oldTemplate = appTemplate;
    appTemplate = generateTemplate(appState)(appActions);

    VDOM.updateDOM(root, oldTemplate, appTemplate);
  };

  const requestRender = () => {
    requestAnimationFrame(render);
  };

  const init = actions => {
    appState = state;
    appActions = bindUpdateToActions(actions);
    appTemplate = generateTemplate(appState)(appActions);

    root.appendChild(VDOM.createElement(appTemplate));
  };

  const generateTemplate = state => actions =>{
    const readOnlyState = Object.assign({}, state);
    const readOnlyActions = Object.assign({}, actions);

    return template(readOnlyState)(readOnlyActions);
  };

  init(actions);
};

export { component };
