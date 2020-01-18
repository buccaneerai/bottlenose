// Numbers and code based on:
// https://machinelearningmastery.com/implement-logistic-regression-stochastic-gradient-descent-scratch-python/
import {expect} from 'chai';
import {marbles} from 'rxjs-marbles/mocha';
import {from,range} from 'rxjs';
import {mergeMap,mapTo,take,takeLast} from 'rxjs/operators';
import fpflow from 'lodash/fp/flow';
import fpflattenDeep from 'lodash/fp/flattenDeep';
import fptimes from 'lodash/fp/times';

import classifier, {testExports} from './classifier';
const {updateWeights, modelTrainer} = testExports;

const trainingData = [
  [[2.7810836, 2.550537003], 0],
  [[1.465489372, 2.362125076], 0],
  [[3.396561688, 4.400293529], 0],
  [[1.38807019, 1.850220317], 0],
  [[3.06407232, 3.005305973], 0],
  [[7.627531214, 2.759262235], 1],
  [[5.332441248, 2.088626775], 1],
  [[6.922596716, 1.77106367], 1],
  [[8.675418651, -0.242068655], 1],
  [[7.673756466, 3.508563011], 1],
];

describe('operators.classifier', () => {
  it('should train model correctly given training data', marbles(m => {
    const options = {
      learningRate: 0.3,
      initialState: { intercept: 0, weights: [0, 0] },
      // intercept: -0.406605464,
      // weights: [0.852573316, -1.104746259]
    };
    const input$ = range(1, 100).pipe(
      mapTo(trainingData),
      mergeMap(epoch => from(epoch))
    );
    const actual$ = input$.pipe(
      classifier(options),
      takeLast(1)
    );
    const expected$ = m.cold('(0|)', {
      0: {
        intercept: -0.8596443546618895,
        weights: [1.5223825112460012, -2.2187002105650175],
        sumOfErrorSquared: 13.722998871774656,
      },
    });
    m.expect(actual$).toBeObservable(expected$);
  }));

  it('.modelTrainer should generate correct model parameters', marbles(m => {
    const options = {
      learningRate: 0.3,
      initialIntercept: -0.406605464,
      initialWeights: [0.852573316, -1.104746259],
    };
    const train$ = from(trainingData).pipe(
      take(1)
    );
    const actual$ = train$.pipe(modelTrainer(options));
    const expected$ = m.cold('(0|)', {
      0: {
        intercept: -0.42538245249966006,
        weights: [0.8003529412262068, -1.1526376629732884],
        sumOfErrorSquared: 0.08925573642394388,
      }
    });
    m.expect(actual$).toBeObservable(expected$);
  }));

  it('.updateWeights() should generate correct weights', () => {
    const params = {
      label: 0,
      row: [2.7810836, 2.550537003],
      learningRate: 0.3,
      intercept: -0.406605464,
      weights: [0.852573316, -1.104746259],
    };
    const actual = updateWeights(params);
    const expected = {
      newIntercept: -0.42538245249966006,
      newWeights: [0.8003529412262068, -1.1526376629732884],
      error: -0.2987569855650975,
    };
    expect(actual).to.deep.equal(expected);
  });
});
