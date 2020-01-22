import keys from 'lodash/keys';
import flow from 'lodash/fp/flow';
import times from 'lodash/fp/times';
import randomstring from 'randomstring';
import {combineLatest,of,zip} from 'rxjs';
import {
  count,
  map,
  mergeMap,
  scan,
  share,
  shareReplay,
  takeLast,
  toArray
} from 'rxjs/operators';

import giniGain from './giniGain';
import bestSplit from './bestSplit';

// returns a stream of individual data points in the form of {_id, feature, label}
function getSamplesInColumn(
  sampleIds,
  columnIndex,
) {
  const columnSample$ = sampleId$.pipe(
    toArray(),
    // get rows with matching sampleIds
    mergeMap(sampleIds => middleware$.pipe(
      where(
        {_id: {$in: sampleIds}},
        {fields: ['_id', columnIndex, 'label'], sort: {[columnIndex]: 1}}
      )
    )),
    // parse rows into output format
    map(row => (
      keys(row).reduce((memo, key) => {
        const name = (
          ['_id', 'label'].indexOf(key) > -1
          ? key
          : 'feature'
        );
        return {...memo, [name]: row[key]};
      }, {})
    ))
  );
  return columnSample$;
}

function getLabelCountForSamples({
  columns$,
  sampleId$,
}) {
  const sampleIdSub$ = sampleId$.pipe(share());
  const labelCounter$ = sampleIdSub$.pipe(
    toArray(),
    mergeMap(sampleIds => zip(
      columns$.pipe(
        mergeMap(cols => cols[0]),
        count() // FIXME - this could be delegated to
      ),
      of()
    )),
    map(([positiveCount, totalCount]) => ({
      0: totalCount - positiveCount,
      1: positiveCount,
    })),
  );
  return labelCounter$;
}

function getLeafIndex({
  middleware$,
  sampleId$,
  leafId
}) {
  const { mapCols } = middleware$;
  const index$ = sampleId$.pipe(
    toArray(),
    mergeMap(sampleIds => middleware$.pipe(
      mapCols(
        row => (sampleIds.indexOf(row._id) === -1 ? 0 : 1),
        {colName: leafId}
      )
    ))
  );
  return index$;
}

function getBestSplits({
  columnStreams,
  totalLabelCount,
  gainOperator,
  maxConcurrentColumnStreams,
  _bestSplit = bestSplit
}) {
  const split$ = of(...columnStreams).pipe(
    scan((memo, columnSampleAscending$) => ([
      columnSampleAscending$,
      memo[1] + 1
    ]), [null, -1]),
    mergeMap(([columnSampleAscending$, columnIndex]) => combineLatest([
      columnSampleAscending$.pipe(_bestSplit(totalLabelCount, gainOperator)),
      of(columnIndex)
    ]), maxConcurrentColumnStreams), // FIXME - this will drop extra columns...
    map(([bSplit, columnIndex]) => ({...bSplit, splitColumn: columnIndex}))
  );
  return split$;
}

const makeLeaf = function makeLeaf({
  leafId,
  numSamples,
  depth,
  parentId,
}) {
  return split$ => split$.pipe(
    scan((bestSplitVal, split) => (
      !bestSplitVal || split.gain > bestSplitVal.gain
      ? split
      : bestSplitVal
    ), null),
    takeLast(1),
    map(bestSplitVal => ({
      parentId,
      numSamples,
      depth,
      _id: leafId,
      splitValue: bestSplitVal.splitValue,
      splitColumn: bestSplitVal.splitColumn,
      splitGain: bestSplitVal.gain,
      childIds: flow(times(() => randomstring.generate(17)))(2),
    })),
  );
};

const cartLeaf = function cartLeaf({
  leafId,
  numSamples, // count of the samples in the column
  columnIndexes,
  parentId,
  depth,
  gainOperator = giniGain,
  _getSamplesInColumn = getSamplesInColumn,
  _getBestSplits = getBestSplits,
  _makeLeaf = makeLeaf,
  _getLabelCountForSamples = getLabelCountForSamples,
  _getLeafIndex = getLeafIndex,
  maxConcurrentColumnStreams = 3,
}) {
  const sampleIdSub$ = sampleId$.pipe(share());
  const totalLabelCountSub$ = _getLabelCountForSamples({
    sampleIds: sampleIdSub,
  }).pipe(shareReplay(1));
  const columnStreams = columnIndexes.map(i => _getSamplesInColumn({
    middleware$,
    sampleId$: sampleIdSub$,
    totalLabelCount$: totalLabelCountSub$,
    columnIndex: i
  }));
  const index$ = _getLeafIndex({
    middleware$,
    leafId,
    sampleId$: sampleIdSub$,
  });
  const split$ = _getBestSplits({
    maxConcurrentColumnStreams,
    columnStreams,
    gainOperator,
    totalLabelCount, // FIXME
  });
  const leaf$ = zip([split$, index$]).pipe(
    takeLast(1),
    map(([split]) => split),
    _makeLeaf({leafId, depth, parentId, numSamples}),
  );
  return leaf$;
};

export const testExports = {
  makeLeaf,
  getBestSplits,
  getLabelCountForSamples,
  getLeafIndex,
  getSamplesInColumn,
};
export default cartLeaf;
