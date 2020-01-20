import takeRight from 'lodash/takeRight';
import {filter,scan} from 'rxjs/operators';

const ngram = function ngram(options = {n: 2}) {
  return source$ => source$.pipe(
    scan((memo, word) => takeRight([...memo, word], options.n), []),
    filter(words => words.length >= options.n),
  );
};

export default ngram;
