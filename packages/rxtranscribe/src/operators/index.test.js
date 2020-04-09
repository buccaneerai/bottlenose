import {expect} from 'chai';

import * as operators from './index';

describe('operators', () => {
    it('should export some modules', () => {
      const api = [
        'toAWS',
      ];
      expect(Object.keys(operators)).to.include(...api);
    });
});
