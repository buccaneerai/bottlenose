import {map,scan} from 'rxjs/operators';

import predictValue from './predictValue';

// # Estimate logistic regression weights using stochastic gradient descent
function updateWeights({
  row,
  label,
  learningRate,
  intercept,
  weights
}) {
  const predictedValue = predictValue({row, intercept, weights});
  const error = (label - predictedValue);
  const newIntercept = (
    intercept + learningRate * error * predictedValue * (1 - predictedValue)
  );
  const newWeights = weights.map((w, index) => (
    w + learningRate * error * predictedValue * (1 - predictedValue) * row[index]
  ));
  return {newWeights, newIntercept, error};
}

// calculates model parameters for SGD classifier
const modelTrainer = function modelTrainer({
  learningRate,
  initialWeights,
  initialIntercept = 0,
}) {
  return source$ => source$.pipe(
    scan(([intercept, weights, sumOfErrorSquared], [row, label]) => {
      const predictedValue = predictValue({
        row,
        intercept,
        weights: weights || initialWeights || row.map(() => 0)
      });
      const {newWeights, newIntercept, error} = updateWeights({
        row,
        label,
        learningRate,
        intercept,
        weights: weights || initialWeights || row.map(() => 0)
      });
      return [newIntercept, newWeights, sumOfErrorSquared + error ** 2];
    }, [initialIntercept, null, 0]),
    map(([intercept, weights, sumOfErrorSquared]) => ({
      intercept,
      weights,
      sumOfErrorSquared,
    }))
  );
};

export const testExports = {updateWeights};
export default modelTrainer;
