import giniGain from './giniGain';
import createSortedColumnsFromRows from '../internals/createSortedColumnsFromRows';

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
