import {expect} from 'chai';

import * as api from './index';

describe('operators', () => {
    it('should export expected modules', () => {
      const expectedApi = [
        'ngram',
        'stem',
        'tokenize'
      ];
      expect(Object.keys(api)).to.deep.equal(expectedApi);
    });
});
