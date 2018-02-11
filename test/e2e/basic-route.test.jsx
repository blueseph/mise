import { commis } from '@mise/test';

import { dom, component } from '../../src';

const { render } = commis();

describe('counter example', () => {
  let currentPath = '/';
  let updateRoutes;
  let routes;

  const Route = ({ template, path, ...props }, children) => {
    if (path === currentPath) return template(props, children);

    return null;
  };

  const TemplateA = () => <main />;
  const TemplateB = () => <article />;
  const TemplateC = () => <aside />;

  beforeEach(async () => {
    document.body.innerHTML = '';
    currentPath = '/';

    component({
      template: () => actions => (
        <div>
          <div id="routes">
            <Route template={TemplateA} path="/" />
            <Route template={TemplateB} path="/test" />
            <Route template={TemplateC} path="/test/two" />
          </div>

          <button id="update" onclick={actions.updateRoutes} />
        </div>
      ),
      state: {},
      actions: {
        updateRoutes: () => {},
      },
    });

    await render(100);

    updateRoutes = document.querySelector('#update');
    routes = document.querySelector('#routes');
  });

  it('should render', () => {
    expect(routes.innerHTML).not.toEqual('');
  });

  it('should render the initial route', () => {
    expect(routes.innerHTML).toEqual('<main></main>');
  });

  it('should handle an updated path', async () => {
    currentPath = '/test';
    updateRoutes.click();

    await render(100);
    expect(routes.innerHTML).toEqual('<article></article>');
  });

  it('should render a final path', async () => {
    currentPath = '/test/two';
    updateRoutes.click();

    await render(100);
    expect(routes.innerHTML).toEqual('<aside></aside>');
  });
});
