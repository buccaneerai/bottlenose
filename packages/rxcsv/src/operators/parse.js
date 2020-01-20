import csvParse from 'csv-parse/lib/sync';
import {filter,map,scan,tap} from 'rxjs/operators';

const parse = function parse(options = {}) {
  return csvStr$ => csvStr$.pipe(
    scan(([, lastChunk], fileChunk) => (
      `${lastChunk}${fileChunk}`.split('\n')
    ), ['', '']),
    // tap(console.log),
    scan(([,index, keys], [row]) => [
      row,
      index + 1,
      (
        index === -1
        ? row.split(',')
        : keys
      )
    ], [null, -1, null]),
    filter(([,index]) => index > 0),
    tap(console.log),
    map(([csvRow, index, keys]) => csvParse(csvRow, {columns: keys, ...options}))
  );
};

export default parse;
