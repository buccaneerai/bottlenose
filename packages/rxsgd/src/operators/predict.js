import {map} from 'rxjs/operators';

import predictValue from '../internals/predictValue';

const predict = function predict({
  intercept,
  weights,
  // featuresTrainedOn,
}) {
  return source$ => source$.pipe(
    map(row => predictValue({row, intercept, weights})),
    // map(predictedValue => (
    //   confidence > 0.5
    //   ? {label: 1, confidence}
    //   : {label: 0, confidence}
    // ))
  );
};

export default predict;
