import {expect} from 'chai';
import { marbles } from 'rxjs-marbles/mocha';

import disconnections from './disconnections';
import { DISCONNECT } from '../internals/actions';

describe('disconnections operator', () => {
  it('should emit the connection objects from a websocket', marbles(m => {
    const startTime = new Date();
    const input$ = m.cold('0-1(23)4-5|', {
      0: ['client', {data: {startTime}, type: DISCONNECT}],
      1: ['client', {type: 'notaconnection'}],
      2: ['client', {data: {startTime}, type: DISCONNECT}],
      3: ['client', {data: {startTime}, type: 'notaconnection'}],
      4: ['client', {type: 'notaconnection'}],
      5: ['client', {data: {startTime}, type: DISCONNECT}],
    });
    const actual$ = input$.pipe(disconnections());
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
