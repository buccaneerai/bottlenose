import {expect} from 'chai';
import sinon from 'sinon';
import {BehaviorSubject,from,of} from 'rxjs';
import {skip,takeLast} from 'rxjs/operators';
import {marbles} from 'rxjs-marbles/mocha';

import send, {MESSAGE_TO_SEND, testExports} from './send';
import { CLIENT_CREATE, RECONNECT_DONE, NEW_MESSAGE } from '../internals/actions';
const {bufferMessages} = testExports;

describe('operators.send', () => {
  it('should throw an error when passed a first parameter that is not an observable', marbles(m => {
    const error = new Error('send() operator takes an Observable as its first parameter.');
    const input$ = m.cold('--01---2(3|)', [
      {text: 'bar'},
      {text: 'whatever'},
      {text: 'sup'},
      {text: 'guten tag'},
    ]);
    const actual$ = input$.pipe(send('notAnObservable'));
    m.expect(actual$).toBeObservable(m.cold('#', null, error));
  }));

  it('should generate correct subscriptions and pass output through from websocket', marbles(m => {
    const startTime = new Date();
    const client = {send: sinon.spy()};
    const ws$ = m.cold('0-1(23)4-5', {
      0: [client, {data: {startTime}, type: CLIENT_CREATE}],
      1: [client, {type: 'notaconnection'}],
      2: [client, {data: {startTime}, type: NEW_MESSAGE}],
      3: [client, {data: {startTime}, type: 'notaconnection'}],
      4: [client, {type: 'notaconnection', type: NEW_MESSAGE}],
      5: [client, {data: {startTime}, type: RECONNECT_DONE}],
    });
    const message$ = m.cold('--01---2(3)', [
      {text: 'bar'},
      {text: 'whatever'},
      {text: 'sup'},
      {text: 'guten tag'},
    ]);
    const actual$ = message$.pipe(send(ws$));
    m.expect(actual$).toBeObservable(ws$);
    m.expect(message$).toHaveSubscriptions('^-------');
    m.expect(ws$).toHaveSubscriptions('^---------');
  }));

  // it('should handle case where websocket emits after messages', marbles(m => {
  //   const startTime = new Date();
  //   const client = {send: sinon.spy()};
  //   const ws$ = m.cold('--01(23)4-5', {
  //     0: [client, {data: {startTime}, type: CLIENT_CREATE}],
  //     1: [client, {type: 'notaconnection'}],
  //     2: [client, {data: {startTime}, type: NEW_MESSAGE}],
  //     3: [client, {data: {startTime}, type: 'notaconnection'}],
  //     4: [client, {type: 'notaconnection', type: NEW_MESSAGE}],
  //     5: [client, {data: {startTime}, type: RECONNECT_DONE}],
  //   });
  //   const message$ = from([
  //     {text: 'bar'},
  //     {text: 'whatever'},
  //     {text: 'sup'},
  //     {text: 'guten tag'},
  //   ]);
  //   const _emit = sinon.spy();
  //   const _sendMessage = sinon.stub().returns(_emit);
  //   const actual$ = message$.pipe(send(ws$, JSON.stringify, _sendMessage));
  //   m.expect(actual$).toBeObservable(ws$);
  //   m.expect(message$).toHaveSubscriptions('^-------');
  //   m.expect(ws$).toHaveSubscriptions('^---------');
  //   expect(_sendMessage.calledOnce).to.be.true;
  //   expect(_emit.callCount).to.equal(4);
  // }));

  it('should buffer messages before websocket connects', marbles(m => {
    const startTime = new Date();
    const client = {send: sinon.spy()};
    const events = {
      0: {message: {text: 'bar'}, type: MESSAGE_TO_SEND},
      1: {message: {text: 'whatever'}, type: MESSAGE_TO_SEND},
      2: [client, {data: {startTime}, type: CLIENT_CREATE}],
      3: [client, {data: {startTime}, type: NEW_MESSAGE}],
      4: {message: {text: 'hallo'}, type: MESSAGE_TO_SEND},
      5: [client, {data: {startTime}, type: 'notaconnection'}],
      6: [client, {type: 'notaconnection', type: NEW_MESSAGE}],
      7: [client, {data: {startTime}, type: RECONNECT_DONE}],
    };
    const input$ = m.cold('01-23--4567', events);
    const actual$ = input$.pipe(bufferMessages());
    const expected$ = m.cold('---(01)x', {
      0: [events[0].message, events[2]],
      1: [events[1].message, events[2]],
      x: [events[4].message, events[3]],
    });
    m.expect(actual$).toBeObservable(expected$);
  }));
});
