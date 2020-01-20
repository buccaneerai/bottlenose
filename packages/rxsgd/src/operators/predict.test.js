// Numbers and code based on:
// https://machinelearningmastery.com/implement-logistic-regression-stochastic-gradient-descent-scratch-python/
import {expect} from 'chai';
import {marbles} from 'rxjs-marbles/mocha';
import {from,range} from 'rxjs';
import {mergeMap,mapTo,take,takeLast} from 'rxjs/operators';

import predict from './predict';

describe('operators.predict', () => {
  it('should generate correct prediction when given model parameters and a row', marbles(m => {
    const row$ = m.cold('--0----1-|)', [
      [7.673756466, 3.508563011],
      [1.38807019, 1.850220317],
    ]);
    const params = {
      intercept: -0.8596443546618895,
      weights: [1.5223825112460012, -2.2187002105650175],
    };
    const actual$ = row$.pipe(predict(params));
    const expected$ = m.cold('--0----1-|)', [
      0.9542746551950381,
      0.054601004287547356,
    ]);
    m.expect(actual$).toBeObservable(expected$);
  }));
});
