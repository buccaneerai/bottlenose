import sortBy from 'lodash/sortBy';
import {zip} from 'rxjs';
import {map,mergeMap,scan,takeLast,tap} from 'rxjs/operators';

import giniGain from './giniGain';

function createSortedColumnsFromRows() {
  return row$ => row$.pipe(
    scan(([index], [features, label]) => [
      index + 1,
      features,
      label,
    ], [-1, null, null]),
    map(([index, features, label]) => (
      features.map(feature => ({index, feature, label}))
    )),
    tap(console.log),
    scan((dataframe, columns) => {
      if (!dataframe) return columns.map(c => [c]);
      columns.map((colVal, colIndex) => dataframe[colIndex].push(colVal));
      return dataframe;
    }, null),
    tap(console.log),
    takeLast(1),
    map(df => df.map(column => sortBy(column, val => val.feature)))
  );
}

const cartTree = function cartTree({
  initialState = {},
  presorted = false,
  gainOperator = giniGain,
  maxLeaves = 100,
  maxDepth = 10,
}) {
  return row$ => row$.pipe(
    // create a dataframe with all of the data stored as a matrix
    createSortedColumnsFromRows()
    // scan((columns, newCols) => (
    // ), [])
  );
};

export const testExports = {
  createSortedColumnsFromRows
};
export default cartTree;
