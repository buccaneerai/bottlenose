import {of} from 'rxjs';
import {WordTokenizer} from 'natural';
import {map,mergeMap} from 'rxjs/operators';

const defaultTokenizer = new WordTokenizer();

const defaultOptions = {
  tokenizer: params => defaultTokenizer.tokenize(params)
};

const tokenize = function tokenize(options = defaultOptions) {
  return string$ => string$.pipe(
    map(str => options.tokenizer(str)),
    mergeMap(words => of(...words))
  );
};

export default tokenize;
