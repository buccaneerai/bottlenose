import {LancasterStemmer, PorterStemmer} from 'natural';
import {map} from 'rxjs/operators';

const stem = function stem(options = {stemmer: 'porter'}) {
  const stemMapper = (
    options.stemmer === 'lancaster'
    ? LancasterStemmer.stem
    : PorterStemmer.stem
  );
  return source$ => source$.pipe(
    map(stemMapper)
  );
};

export default stem;
