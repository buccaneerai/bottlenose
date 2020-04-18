import {expect} from 'chai';

import * as api from './index';

describe('index', () => {
  it('should export operator functions', () => {
    const expectedApi = [
      'toAWS',
      'toDeepSpeech',
      'toGCP'
    ];
    expect(Object.keys(api)).to.deep.equal(expectedApi);
  });
});
