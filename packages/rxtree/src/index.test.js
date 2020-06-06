import {expect} from 'chai';

import * as api from './index';

describe('index', () => {
  it('should export operator functions', () => {
    const expectedApi = [
      'classifier',
    ];
    expect(Object.keys(api)).to.deep.equal(expectedApi);
  });
});
