import {expect} from 'chai';

import * as api from './index';

describe('index', () => {
  it('should export public API', () => {
    const functions = [
      'broadcast',
      'client',
      'conduit',
      'connections',
      'disconnections',
      'messages',
      'ws',
    ];
    expect(Object.keys(api)).to.deep.equal(functions);
    expect(api.ws).to.be.a('function');
  });
});
