import isNumber from 'lodash/isNumber';
import flow from 'lodash/fp/flow';
import reduce from 'lodash/fp/reduce';
import toPairs from 'lodash/fp/toPairs';
import {zip} from 'rxjs';
import {filter,map,scan,shareReplay,takeLast} from 'rxjs/operators';

import giniGain from './giniGain';

function aggregateSplits(
  [olderSample, priorSample, counter], // memo for the reduce loop
  currentSample // the latest sample/record/row in the column
) {
  const labelCount = (
    isNumber(counter[currentSample.label])
    ? {...counter, [currentSample.label]: counter[currentSample.label] + 1}
    : {...counter, [currentSample.label]: 1}
  );
  return [priorSample, currentSample, labelCount];
}

function findSplits() {
  return columnValue$ => columnValue$.pipe(
    scan(aggregateSplits, [null, null, {}]),
    filter(([priorSample, currentSample]) => (
      priorSample && priorSample.label !== currentSample.label
    )),
    map(([priorSample, currentSample, counter]) => ({
      splitValue: currentSample.feature,
      labelCounts: counter,
    }))
  );
}

function findBestSplit(totalLabelCounts, gainOperator) {
  return split$ => {
    const sourceSub$ = split$.pipe(shareReplay(100));
    const gain$ = sourceSub$.pipe(
      map(split => {
        const labelCountsBelow = flow([
          toPairs,
          reduce((counter, [label, totalCount]) => (
            {...counter, [label]: totalCount - split.labelCounts[label]}
          ), {})
        ])(totalLabelCounts);
        return {...split, labelCountsBelow};
      }),
      map(split => [split.labelCounts, split.labelCountsBelow]),
      gainOperator(totalLabelCounts),
    );
    const bestSplit$ = zip(split$, gain$).pipe(
      scan((memo, [split, gain]) => (
        !memo || memo.gain < gain
        ? {...split, gain}
        : memo
      ), null),
      takeLast(1)
    );
    return bestSplit$;
  };
}

/**
   * @name external:bestSplit
   * @param {Observable} totalLabelCounts
   * @param {Function}   gainOperator - the function to be used for calculating
                         the gain of various splits
   * @return {Observable} an observable which emits the best split in the form:
                          {feature, index, gain, counter}
   */
const bestSplit = function bestSplit(
  totalLabelCounts,
  gainOperator = giniGain
) {
  // source$ should emit values in the form of [columnValue, totalLabelCount]
  // columnValue is a stream of column values in ascending order in the form of
  // {index, feature, label}
  // totalLabelCount is a count of the total number of samples
  return columnValueAscending$ => columnValueAscending$.pipe(
    findSplits(),
    findBestSplit(totalLabelCounts, gainOperator)
  );
};

export const testExports = {
  aggregateSplits,
  findBestSplit,
  findSplits
};
export default bestSplit;
