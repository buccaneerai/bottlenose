import {expect} from 'chai';

import * as creators from './index';

describe('creators', () => {
  it('should export ws function', () => {
    const api = [
      'ws',
      // 'wsManager'
    ];
    expect(creators.ws).to.be.a('function');
    expect(Object.keys(creators)).to.deep.equal(api);
  });
});
