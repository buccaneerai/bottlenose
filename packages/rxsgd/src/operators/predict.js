import {map} from 'rxjs/operators';

import predictValue from '../internals/predictValue';

const predict = function predict({
  intercept,
  weights,
  featuresTrainedOn,
}) {
  return source$ => source$.pipe(
    map(row => predictValue({row, intercept, weights}))
  );
};

export default predict;
