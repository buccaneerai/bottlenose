import {expect} from 'chai';
import sinon from 'sinon';
import {marbles} from 'rxjs-marbles/mocha';
import {of} from 'rxjs';
import {mapTo} from 'rxjs/operators';

import bufferBetweenSilences from './bufferBetweenSilences';

describe('operators.bufferBetweenSilences', () => {
  it('should buffer chunks until next silence after time threshold is met', marbles(m => {
    const chunk$ = m.cold('01 2ms -234 2ms 5--|', [0, 1, 2, 3, 4, 5]);
    const params = {
      _toVAD: () => (src$ => src$.pipe(mapTo([0, {type: 'SILENCE'}]))),
      timeInterval: 2,
    };
    const actual$ = chunk$.pipe(bufferBetweenSilences(params));
    const expected$ = m.cold('-----0--1|', [
      [0, 1],
      [2, 3],
      [4, 5],
    ]);
    m.expect(actual$).toBeObservable(expected$);
  }));
});
