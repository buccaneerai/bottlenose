import {expect} from 'chai';
import sinon from 'sinon';
import {marbles} from 'rxjs-marbles/mocha';

import appendFile from './appendFile';

describe('appendFile', () => {
  it('should correctly call file append workflow', marbles(m => {
    const input$ = m.cold('--0--12|', ['arr', 'yarr', 'matey']);
    const params = {
      filePath: 'output.csv',
      _appendFile: sinon.stub().returns(null),
      options: {encoding: 'utf8'},
    };
    const output$ = input$.pipe(appendFile(params));
    const expected$ = m.cold('--0--12|', [null, null, null]);
    // m.expect(output$).toBeObservable(expected$);
    // expect(params._appendFile.callCount).to.equal(3);
    // expect(params._appendFile.getCall(2).args).to.deep.equal([
    //   params.filePath,
    //   'matey',
    //   params.options,
    // ]);
  }));
});
