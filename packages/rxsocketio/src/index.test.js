import {expect} from 'chai';

import * as api from './index';

describe('module', () => {
    it('should export API', () => {
      const expectedApi = [
        'conduit',
        'consume',
        'fromIO',
        'send',
      ];
      expect(Object.keys(api)).to.deep.equal(expectedApi);
    });
});
