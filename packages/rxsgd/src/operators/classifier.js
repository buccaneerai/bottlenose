// Code is modeled after this blog post:
// https://machinelearningmastery.com/implement-logistic-regression-stochastic-gradient-descent-scratch-python/
import {map,scan} from 'rxjs/operators';

import modelTrainer from '../internals/modelTrainer';
import predict from './predict';

const classifier = function classifier({
  learningRate = 0.3,
  initialState = {},
  // epochs = 1
}) {
  return source$ => source$.pipe(
    modelTrainer({
      learningRate,
      initialIntercept: initialState.intercept || 0,
      initialWeights: initialState.weights,
    }),
    map(({intercept, weights}) => ({
      modelType: 'sgd',
      modelParams: {intercept, weights},
      featuresTrainedOn: [],
      labelsTrainedOn: [],
      lastUpdatedAt: (new Date()).toISOString(),
    }))
  );
};

export default classifier;
