// Code is modeled after this blog post:
// https://machinelearningmastery.com/implement-logistic-regression-stochastic-gradient-descent-scratch-python/
import {map,scan} from 'rxjs/operators';

function predict(row, intercept, weights) {
  const predictedValue = weights.reduce((memo, weight, i) => (
    memo + weight * row[i]
  ), intercept);
  return 1.0 / (1.0 + Math.E ** -predictedValue);
}

// # Estimate logistic regression weights using stochastic gradient descent
function updateWeights({
  row,
  label,
  learningRate,
  intercept,
  weights
}) {
  const predictedValue = predict(row, intercept, weights);
  const error = (label - predictedValue);
  const newIntercept = (
    intercept + learningRate * error * predictedValue * (1 - predictedValue)
  );
  const newWeights = weights.map((w, index) => (
    w + learningRate * error * predictedValue * (1 - predictedValue) * row[index]
  ));
  return {newWeights, newIntercept, error};
}

// # Estimate logistic regression coefficients using stochastic gradient descent
// def coefficients_sgd(train, l_rate, n_epoch):
//   coef = [0.0 for i in range(len(train[0]))]
//   for epoch in range(n_epoch):
//     sum_error = 0
//     for row in train:
//       yhat = predict(row, coef)
//       error = row[-1] - yhat
//       sum_error += error**2
//       coef[0] = coef[0] + l_rate * error * yhat * (1.0 - yhat)
//       for i in range(len(row)-1):
//         coef[i + 1] = coef[i + 1] + l_rate * error * yhat * (1.0 - yhat) * row[i]
//   return coef

// calculates model parameters for SGD classifier
function modelTrainer({
  learningRate,
  initialWeights,
  initialIntercept
}) {
  return source$ => source$.pipe(
    scan(([intercept, weights, sumOfErrorSquared], [row, label]) => {
      const predictedValue = predict(row, intercept, weights);
      const {newWeights, newIntercept, error} = updateWeights({
        row,
        label,
        learningRate,
        intercept,
        weights
      });
      return [newIntercept, newWeights, sumOfErrorSquared + error ** 2];
    }, [initialIntercept, initialWeights, 0]),
    map(([intercept, weights, sumOfErrorSquared]) => ({
      intercept,
      weights,
      sumOfErrorSquared,
    }))
  );
}

const classifier = function classifier({
  learningRate = 0.3,
  initialState = {},
  // epochs = 1
}) {
  return source$ => source$.pipe(
    modelTrainer({
      learningRate,
      initialIntercept: initialState.intercept || 0,
      initialWeights: initialState.weights // FIXME - should be optional
    })
  );
};

export const testExports = {predict, updateWeights, modelTrainer};
export default classifier;
