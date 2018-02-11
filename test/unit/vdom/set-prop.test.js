import { setProp } from '../../../src/vdom';

describe('set prop', () => {
  it('should try to set a prop naively', () => {
    const element = {};
    const attribute = 'value';
    const value = 'abc';

    setProp(element, attribute, value);

    expect(element).toEqual({
      [attribute]: value,
    });
  });

  it('shouldnt care if an error gets thrown', () => {
    const element = {};
    Object.defineProperty(element, 'value', {
      value: true,
      writable: false,
    });

    const attribute = 'value';
    const value = 'abc';

    expect(() => setProp(element, attribute, value)).not.toThrow();
  });

  it('should try to setAttribute', () => {
    const spy = jest.fn();
    const element = {
      setAttribute: spy,
    };
    const attribute = 'class';
    const value = 'abc';

    setProp(element, attribute, value);

    expect(element).toEqual({
      [attribute]: value,
      setAttribute: spy,
    });

    expect(spy).toBeCalledWith(attribute, value);
  });
});
