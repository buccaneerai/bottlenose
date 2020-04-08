import { expect } from 'chai';
import { marbles } from 'rxjs-marbles/mocha';

import consume from './consume';
import { NEW_MESSAGE } from '../internals/actions';

// the WebSocket emits consume wrapped in an object
function formatData(message) {
  const msg = {data: JSON.stringify(message)};
  return { message: msg };
}

describe('operators.consume', () => {
  it('should emit message objects received from WebSocket', marbles(m => {
    const messageArr = [
      {foo: 'bar'},
      {another: 'please'},
      {sitrep: 'snafu'},
    ];
    const inputs = {
      0: ['client', {type: NEW_MESSAGE, data: formatData(messageArr[0])}],
      1: ['client', {type: 'notamessage'}],
      2: ['client', {type: NEW_MESSAGE, data: formatData(messageArr[1])}],
      3: ['client', {data: {foo: 'bar'}, type: 'notamessage'}],
      4: ['client', {type: 'notamessage'}],
      5: ['client', {type: NEW_MESSAGE, data: formatData(messageArr[2])}],
    };
    const input$ = m.cold('0-1(23)4-5|', inputs);
    const actual$ = input$.pipe(consume());
    m.expect(actual$).toBeObservable(m.cold(
      '0--2-----5|',
      {
        0: messageArr[0],
        2: messageArr[1],
        5: messageArr[2],
      }
    ));
  }));

  // it('should emit consume from topic when given a topic objects', marbles(m => {
  //   const inputs = {
  //     0: ['client', {data: {message: JSON.stringify({foo: 'bar'})}, type: NEW_MESSAGE}],
  //     1: ['client', {type: 'notamessage'}],
  //     2: ['client', {data: {message: JSON.stringify({another: 'please'})}, type: NEW_MESSAGE}],
  //     3: ['client', {data: {foo: 'bar'}, type: 'notamessage'}],
  //     4: ['client', {type: 'notamessage'}],
  //     5: ['client', {data: {message: JSON.stringify({sitrep: 'snafu'})}, type: NEW_MESSAGE}],
  //   };
  //   const input$ = m.cold('0-1(23)4-5|', inputs);
  //   const actual$ = input$.pipe(consume('dunno'));
  //   m.expect(actual$).toBeObservable(m.cold(
  //     '---------5|',
  //     {
  //       0: JSON.parse(inputs[0][1].data.message),
  //       2: JSON.parse(inputs[2][1].data.message),
  //       5: JSON.parse(inputs[5][1].data.message),
  //     }
  //   ));
  // }));
});
