import { reconciler } from './vdom/reconciler';
import { create } from './vdom/fiber';

const component = ({
  template, state, actions, root = document.body,
}) => {
  const { add } = reconciler();

  let appState;
  let appTemplate;
  let appActions;

  const generateTemplate = unsafeState => (unsafeActions) => {
    const readOnlyState = { ...unsafeState };
    const readOnlyActions = { ...unsafeActions };

    return template(readOnlyState)(readOnlyActions);
  };

  const render = () => {
    const previousTemplate = appTemplate;
    appTemplate = generateTemplate(appState)(appActions);

    add(create({
      parent: root,
      element: root.childNodes[0],
      previous: previousTemplate,
      next: appTemplate,
    }));
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

    const fiber = create({
      parent: root,
      next: appTemplate,
    });

    add(fiber);
  };

  init(actions);
};

export { component };
