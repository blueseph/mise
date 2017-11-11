import { vdom } from '../vdom';

jest.mock('../vdom', () => ({
  vdom: jest.fn(),
}));

const vdomMock = {
  paint: () => jest.fn(),
};

vdom.mockImplementation(() => vdomMock);

export { vdom };
