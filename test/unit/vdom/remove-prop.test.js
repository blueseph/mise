import { removeProp } from '../../../src/vdom';

describe('set prop', () => {
  it('should try to removeAttribute', () => {
    const spy = jest.fn();
    const element = {
      removeAttribute: spy,
    };
    const attribute = 'class';

    removeProp(element, attribute);

    expect(spy).toBeCalledWith(attribute);
  });
});
