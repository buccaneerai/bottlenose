import {expect} from 'chai';
import {marbles} from 'rxjs-marbles/mocha';

import shortenChunks from './shortenChunks';

describe('internals.shortenChunks', () => {
  it('should correctly divide input into chunks', marbles(m => {
    const data = [
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
    ];
    const input$ = m.cold('-0--------1', data);
    const expected = [
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
      [9]
    ];
    const expected$ = m.cold('-(01234)--(01234)', expected);
    const actual$ = input$.pipe(shortenChunks(2));
    m.expect(actual$).toBeObservable(expected$);
  }));
});
