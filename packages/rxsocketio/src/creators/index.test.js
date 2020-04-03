import {expect} from 'chai';

import * as creators from './index';

describe('creators', () => {
  it('should export creators', () => {
    const api = [
      'io',
      // 'wsManager'
    ];
    expect(creators.io).to.be.a('function');
    expect(Object.keys(creators)).to.deep.include(...api);
  });
});
