import { commis } from '@mise/test';
import { dom, component } from '../../src';

const { render } = commis();

describe('context example', () => {
  const { body } = document;

  const Siblings = ({ siblings }) => (
    <div id="siblings">
      this person has {siblings.length} siblings
    </div>
  )

  const AddSibling = ({ addSibling }) => (
    <button id="addsibling" onclick={addSibling}>Add A Sibling</button>
  )

  const Person = ({ name, age }) => (
    <main id="person">
      <h1>{name}</h1>
      <div>{age}</div>
    </main>
  );

  const ChangeName = ({ changeName }) => (
    <button id="changename" onclick={changeName}>Change Name To Bruce</button>
  )

  const Family = () => (
    <div>
      <Person $MiseState />
      <ChangeName $MiseActions />

      <Siblings $MiseState={state => state.relationships} />
    </div>
  );

  const template = state => actions => (
    <div>
      <Family />
    </div>
  );

  beforeEach(async () => {
    body.innerHTML = '';

    component({
      template,
      state: {
        name: 'dan',
        age: '18',
        relationships: {
          siblings: [
            { name: 'joshua', age: '14' },
            { name: 'nicole', age: '16' },
          ],
        },
      },
      actions: {
        changeName: () => ({ name: 'bruce' }),
      },
    });

    await render(250);
  });

  it('should load', async () => {
    expect(body.innerHTML).not.toBe('');
  });

  it('should render with the proper state assigned via context', async () => {
    expect(body.querySelector('#person').innerHTML).toBe('<h1>dan</h1><div>18</div>');
  });

  it('should have an onclick passed in via context', async () => {
    body.querySelector('#changename').click();

    await render();
    expect(body.querySelector('#person').innerHTML).toBe('<h1>bruce</h1><div>18</div>');
  });

  it('should have a pared down version of the state if a function is passed in', () => {
    expect(body.querySelector('#siblings').innerHTML).toBe('this person has 2 siblings');
  });
});
