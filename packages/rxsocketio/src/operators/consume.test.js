import {expect} from 'chai';
import {marbles} from 'rxjs-marbles/mocha';

import consume from './consume';
import {NEW_MESSAGE} from '../internals/actions';

describe('consume', () => {
  it('should emit messages from the socket.io client', marbles(m => {
    const messages = [
      [{}, {type: NEW_MESSAGE, data: {foo: 'bar'}}],
      [{}, {type: NEW_MESSAGE, data: {hello: 'bonjour'}}],
    ];
    const io$ = m.cold('-0-1-|', messages);
    const actual$ = io$.pipe(consume());
    const expected$ = m.cold('-0-1-|', messages.map(([,m]) => m.data));
    m.expect(actual$).toBeObservable(expected$);
  }));
});
