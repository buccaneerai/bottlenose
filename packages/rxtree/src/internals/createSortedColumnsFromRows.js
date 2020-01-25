import sortBy from 'lodash/sortBy';
import {map,scan,takeLast} from 'rxjs/operators';

const createSortedColumnsFromRows = function createSortedColumnsFromRows() {
  return row$ => row$.pipe(
    scan(([index], [features, label]) => [
      index + 1,
      features,
      label,
    ], [-1, null, null]),
    map(([index, features, label]) => (
      features.map(feature => ({index, feature, label}))
    )),
    scan((dataframe, columns) => {
      if (!dataframe) return columns.map(c => [c]);
      columns.map((colVal, colIndex) => dataframe[colIndex].push(colVal));
      return dataframe;
    }, null),
    takeLast(1),
    map(df => df.map(column => sortBy(column, val => val.feature)))
  );
};

export default createSortedColumnsFromRows;
