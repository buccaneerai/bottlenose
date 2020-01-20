import {scan} from 'rxjs/operators';

const parse = function parse() {
  return csvStr$ => csvStr$.pipe(
    // scan(csvPart => , '')
  );
};

export default parse;
