import {expect} from 'chai';

import * as api from './index';

describe('index', () => {
  it('should export public API', () => {
    const functions = [
      'ws',
      'broadcast',
      'client',
      'connections',
      'disconnections',
      'messages',
    ];
    expect(Object.keys(api)).to.deep.equal(functions);
    expect(api.ws).to.be.a('function');
  });
});
