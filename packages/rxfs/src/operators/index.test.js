import {expect} from 'chai';

import * as operators from './index';

describe('operators', () => {
    it('should export expected modules', () => {
      const api = [
        'appendFile',
        'writeFile',
      ];
      expect(Object.keys(operators)).to.deep.equal(api);
    });
});
