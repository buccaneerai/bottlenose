import { zip } from 'rxjs';
import { map, share, skip } from 'rxjs/operators';

import dirtyR from './dirtyR';
import mean from './mean';
import stdev from './stdev';

const dirtyLinearRegression = function dirtyLinearRegression() {
  return source$ => {
    const input$ = source$.pipe(
      share()
    );
    const xMean$ = source$.pipe(
      skip(1),
      map(instance => instance[0]),
      mean()
    );
    const yMean$ = source$.pipe(
      skip(1),
      map(instance => instance[instance.length - 1]),
      mean()
    );
    const xStdev$ = source$.pipe(
      map(instance => instance[0]),
      stdev()
    );
    const yStdev$ = source$.pipe(
      map(instance => instance[instance.length - 1]),
      stdev()
    );
    const r$ = input$.pipe(
      dirtyR()
    );
    const regression$ = zip(r$, xMean$, yMean$, xStdev$, yStdev$).pipe(
      map(([r, xMean, yMean, xStdev, yStdev]) => {
        const slope = r * (yStdev / xStdev);
        const intercept = yMean - slope * xMean;
        return {
          intercept,
          slope,
          predict: x => (slope * x) + intercept
        };
      })
    );
    return regression$;
  };
};

export default dirtyLinearRegression;
