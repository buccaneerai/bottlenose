import {expect} from 'chai';

import * as api from './index';

describe('operators', () => {
    it('should export operators', () => {
      const expectedApi = [
        'conduit',
      ];
      expect(Object.keys(api)).to.include(...expectedApi);
    });
});
