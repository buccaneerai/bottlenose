import {zip} from 'rxjs';
import {mergeMap,scan} from 'rxjs/operators';

import giniGain from './giniGain';

const cartTree = function cartTree({
  initialState = {},
  presorted = false,
  gainOperator = giniGain,
  maxLeaves = 100,
  maxDepth = 10,
}) {
  return row$ => row$.pipe(
    scan(([index, features, label]) => [
      index + 1,
      features,
      label
    ], [-1, null, null]),
    mergeMap(([index, features, label]) => zip(
      features.map(feature => ({index, feature, label}))
    )),
    scan((columns, newCols) =>,
    [])
  );
};

export const testExports = {
};
export default cartTree;
