import { zip } from 'rxjs';
import { map, mapTo, share, skip } from 'rxjs/operators';

import mean from './mean';
import stdev from './stdev';

function meanOp(state) {
  if (state && state.trueMean) return mapTo(state.trueMean);
  if (state && state.meanState) return mean(state.meanState);
  return mean();
}

function stdevOp(state) {
  if (state && state.trueStdev) return mapTo(state.trueStdev);
  if (state && state.stdevState) return stdev(state.stdevState);
  return stdev();
}

// https://www.khanacademy.org/math/ap-statistics/bivariate-data-ap/correlation-coefficient-r/v/calculating-correlation-coefficient-r
const dirtyZScore = function dirtyZScore(initialState) {
  return source$ => {
    const skipCount = (
      initialState && initialState.stdevState && initialState.stdevState > 0
      ? 0
      : 1
    );
    const sourceSub$ = source$.pipe(share());
    // FIXME - should only skip when the stdev skips...
    const mean$ = sourceSub$.pipe(meanOp(initialState), skip(skipCount));
    const stdev$ = sourceSub$.pipe(stdevOp(initialState));
    const zScore$ = zip(sourceSub$.pipe(skip(skipCount)), mean$, stdev$).pipe(
      map(([instanceVal, _mean, _stdev]) => ((instanceVal - _mean) / _stdev))
    );
    return zScore$;
  };
};

export default dirtyZScore;
