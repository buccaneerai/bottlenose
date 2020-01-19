import _ from 'lodash';
import {expect} from 'chai';
import {marbles} from 'rxjs-marbles/mocha';
import {take} from 'rxjs/operators';

import tokenize from './tokenize';

const strings = [
  'They sat together in the park',
  'As the evening sky grew dark',
  'She looked at him and he felt a spark tingle to his bones',
];

describe('operators.tokenize', () => {
  it('should properly tokenize simple input strings', marbles(m => {
    const string$ = m.cold('--0--------1(2|)', strings);
    const token$ = string$.pipe(
      tokenize(),
      take(10)
    );
    const expected$ = m.cold('--(012345)-(6789|)', [
      ...strings[0].split(' '),
      ..._.take(strings[1].split(' '), 4),
    ]);
    m.expect(token$).toBeObservable(expected$);
  }));
});

