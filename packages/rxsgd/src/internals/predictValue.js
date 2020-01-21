const predictValue = function predictValue({row, intercept, weights}) {
  const predictedValue = weights.reduce((memo, weight, i) => (
    memo + weight * row[i]
  ), intercept);
  return 1.0 / (1.0 + Math.E ** -predictedValue);
};

export default predictValue;
