import {expect} from 'chai';
import { marbles } from 'rxjs-marbles/mocha';

import connections from './connections';
import { CONNECT, RECONNECT, RECONNECT_DONE } from '../internals/actions';

describe('connections operator', () => {
  it('should emit the connection objects from a websocket', marbles(m => {
    const startTime = new Date();
    const input$ = m.cold('0-1(23)4-5|', {
      0: ['client', {data: {startTime}, type: CONNECT}],
      1: ['client', {type: 'notaconnection'}],
      2: ['client', {data: {startTime}, type: CONNECT}],
      3: ['client', {data: {startTime}, type: 'notaconnection'}],
      4: ['client', {type: 'notaconnection', type: RECONNECT}],
      5: ['client', {data: {startTime}, type: RECONNECT_DONE}],
    });
    const actual$ = input$.pipe(connections());
    m.expect(actual$).toBeObservable(m.cold(
      '0--2-----5|',
      {
        0: {startTime},
        2: {startTime},
        5: {startTime},
      }
    ));
  }));
});
