// import keys from 'lodash/keys';
import flow from 'lodash/fp/flow';
import times from 'lodash/fp/times';
import randomstring from 'randomstring';
import {of,zip} from 'rxjs';
import {map, mergeMap, scan, takeLast, tap} from 'rxjs/operators';

import giniGain from './giniGain';
import bestSplit from './bestSplit';

const makeLeaf = function makeLeaf({
  leafId,
  numSamples,
  depth,
  parentId,
  childIds = null,
}) {
  // Accepts an Observable where each item is an array, containing all of the
  // potential splits in the form of {splitValue: <Number>, gain: <Number>}
  return splits$ => splits$.pipe(
    tap(console.log),
    map(splits => (
      splits.reduce((bSplit, split, index) => (
        !bSplit || split.gain > bSplit.gain
        ? {...split, columnIndex: index}
        : bSplit
      ), null)
    )),
    tap(console.log),
    map(bestSplitVal => ({
      parentId,
      numSamples,
      depth,
      _id: leafId,
      splitValue: bestSplitVal.splitValue,
      splitColumn: bestSplitVal.columnIndex,
      splitGain: bestSplitVal.gain,
      splitLabelCounts: bestSplitVal.labelCounts,
      childIds: childIds || flow(times(() => randomstring.generate(17)))(2),
    })),
  );
};

const cartLeaf = function cartLeaf({
  depth,
  leafId,
  numSamples,
  parentId,
  totalLabelCounts,
  childIds = null,
  gainOperator = giniGain,
  _bestSplit = bestSplit,
  _makeLeaf = makeLeaf,
}) {
  // columns$$ is an Observable of arrays.  Each item in the array is an
  // observable containing the column values for this leaf in the form
  // of {index, feature, label}, pre-sorted in ascending order on the feature value.
  // The values should also be pre-filtered to only include samples that belong in
  // this leaf.
  return sortedColumns$$ => sortedColumns$$.pipe(
    mergeMap(columns$ => zip(
      ...columns$.map(col$ => (
        col$.pipe(_bestSplit(totalLabelCounts, gainOperator))
      ))
    )),
    // mergeMap(splits => of(...splits.map((s, index) => ))),
    takeLast(1),
    _makeLeaf({leafId, depth, parentId, numSamples, childIds})
  );
};

export const testExports = {makeLeaf};
export default cartLeaf;
