import { parse } from 'json2csv';
import { of } from 'rxjs';
import { mergeMap, scan } from 'rxjs/operators';

const toCsv = function toCsv(options = {parserOptions: {}}) {
  return object$ => object$.pipe(
    scan(([index], row) => [index + 1, row], [-1, null]),
    mergeMap(([index, row]) => (
      index === 0
      ? of(parse(row, options.parserOptions))
      : of(parse(row, {...options.parserOptions, header: false}))
    ))
  );
};

export default toCsv;
