// import keys from 'lodash/keys';
// import flow from 'lodash/fp/flow';
// import times from 'lodash/fp/times';
// import randomstring from 'randomstring';
// import { combineLatest, of, zip } from 'rxjs';
// import {
//   // bufferSize,
//   map,
//   mergeMap,
//   publish,
//   publishReplay,
//   scan,
//   takeLast,
//   tap,
//   toArray
// } from 'rxjs/operators';

// import getGiniGain from './getGiniGain';
// import getBestSplit from './getBestSplit';

// // returns a stream of individual data points in the form of {_id, feature, label}
// function getSamplesInColumn({
//   sampleId$,
//   middleware$,
//   columnIndex,
// }) {
//   const { where } = middleware$;
//   const columnSample$ = sampleId$.pipe(
//     toArray(),
//     // get rows with matching sampleIds
//     mergeMap(sampleIds => middleware$.pipe(
//       where(
//         {_id: {$in: sampleIds}},
//         {fields: ['_id', columnIndex, 'label'], sort: {[columnIndex]: 1}}
//       )
//     )),
//     // parse rows into output format
//     map(row => (
//       keys(row).reduce((memo, key) => {
//         const name = (
//           ['_id', 'label'].indexOf(key) > -1
//           ? key
//           : 'feature'
//         );
//         return {...memo, [name]: row[key]};
//       }, {})
//     ))
//   );
//   return columnSample$;
// }

// function getLabelCountForSamples({sampleId$, middleware$}) {
//   const { count } = middleware$;
//   const labelCounter$ = sampleId$.pipe(
//     toArray(),
//     mergeMap(sampleIds => zip(
//       middleware$.pipe(count({_id: {$in: sampleIds}, label: {$eq: 1}})),
//       middleware$.pipe(count())
//     )),
//     map(([positiveCount, totalCount]) => ({
//       0: totalCount - positiveCount,
//       1: positiveCount,
//     })),
//   );
//   return labelCounter$;
// }

// function getLeafIndex({
//   middleware$,
//   sampleId$,
//   leafId
// }) {
//   const { mapCols } = middleware$;
//   const index$ = sampleId$.pipe(
//     toArray(),
//     // FIXME -- this would be better if it just used mongoDB to do an update query
//     mergeMap(sampleIds => middleware$.pipe(
//       mapCols(
//         row => (sampleIds.indexOf(row._id) === -1 ? 0 : 1),
//         {colName: leafId}
//       )
//     ))
//   );
//   return index$;
// }

// function getBestSplits({
//   columnStreams,
//   totalLabelCount$,
//   gainFunction,
//   maxConcurrentColumnStreams,
//   _getBestSplit = getBestSplit
// }) {
//   const split$ = of(...columnStreams).pipe(
//     scan((memo, columnSampleAscending$) => ([
//       columnSampleAscending$,
//       memo[1] + 1
//     ]), [null, -1]),
//     mergeMap(([columnSampleAscending$, columnIndex]) => combineLatest([
//       _getBestSplit({
//         gainFunction,
//         columnSampleAscending$,
//         totalLabelCount$,
//       }),
//       of(columnIndex)
//     ]), maxConcurrentColumnStreams),
//     map(([bestSplit, columnIndex]) => ({...bestSplit, splitColumn: columnIndex}))
//   );
//   return split$;
// }

// function generateLeaf({
//   split$,
//   leafId,
//   numSamples,
//   depth,
//   parentId,
// }) {
//   const leaf$ = split$.pipe(
//     scan(
//       (bestSplit, split) => (
//         !bestSplit || split.gain > bestSplit.gain
//         ? split
//         : bestSplit
//       ),
//       null
//     ),
//     takeLast(1),
//     map(bestSplit => ({
//       parentId,
//       numSamples,
//       depth,
//       _id: leafId,
//       splitValue: bestSplit.splitValue,
//       splitColumn: bestSplit.splitColumn,
//       splitGain: bestSplit.gain,
//       childIds: flow(times(() => randomstring.generate(17)))(2),
//     })),
//   );
//   return leaf$;
// }

// const cart = function cart({
//   sampleId$,
//   middleware$,
//   leafId,
//   numSamples, // count of the samples in the column
//   columnIndexes,
//   parentId,
//   depth,
//   gainFunction = getGiniGain,
//   _getSamplesInColumn = getSamplesInColumn,
//   _getBestSplits = getBestSplits,
//   _generateLeaf = generateLeaf,
//   _getLabelCountForSamples = getLabelCountForSamples,
//   _getLeafIndex = getLeafIndex,
//   maxConcurrentColumnStreams = 3,
// }) {
//   const sampleIdSub$ = sampleId$.pipe(publish());
//   const totalLabelCountSub$ = _getLabelCountForSamples({
//     middleware$,
//     sampleId$: sampleIdSub$,
//   }).pipe(publishReplay(1));
//   const columnStreams = columnIndexes.map(i => _getSamplesInColumn({
//     middleware$,
//     sampleId$: sampleIdSub$,
//     totalLabelCount$: totalLabelCountSub$,
//     columnIndex: i
//   }));
//   const index$ = _getLeafIndex({
//     middleware$,
//     leafId,
//     sampleId$: sampleIdSub$,
//   });
//   const split$ = _getBestSplits({
//     maxConcurrentColumnStreams,
//     columnStreams,
//     gainFunction,
//     totalLabelCount$: totalLabelCountSub$,
//   });
//   totalLabelCountSub$.connect();
//   sampleIdSub$.connect();
//   const leaf$ = zip([split$, index$]).pipe(
//     takeLast(1),
//     mergeMap(([split]) => _generateLeaf({
//       split$: of(split),
//       leafId,
//       depth,
//       parentId,
//       numSamples
//     })),
//   );
//   return leaf$;
// };

// export const testExports = {
//   generateLeaf,
//   getBestSplits,
//   getLabelCountForSamples,
//   getLeafIndex,
//   getSamplesInColumn,
// };
// export default cart;
