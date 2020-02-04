import {expect} from 'chai';
import sinon from 'sinon';
import {BehaviorSubject,from,of} from 'rxjs';
import {skip,takeLast} from 'rxjs/operators';
import {marbles} from 'rxjs-marbles/mocha';

import broadcast from './broadcast';
import { CLIENT_CREATE, RECONNECT_DONE, NEW_MESSAGE } from '../internals/actions';

describe('operators.broadcast', () => {
  it('should throw an error when passed a first parameter that is not an observable', marbles(m => {
    const error = new Error('broadcast() operator takes an Observable as its first parameter.');
    const input$ = m.cold('--01---2(3|)', [
      {text: 'bar'},
      {text: 'whatever'},
      {text: 'sup'},
      {text: 'guten tag'},
    ]);
    const actual$ = input$.pipe(broadcast('notAnObservable'));
    m.expect(actual$).toBeObservable(m.cold('#', null, error));
  }));

  it('should call the .send() method on each message', done => {
    const client = {send: sinon.spy()};
    const ws$ = of([client, {type: 'SOMEACTION', data: {foo: 'bar'}}]);
    const messages = [{text: 'hola'}, {text: 'guten tag'}];
    // ws$.client = new BehaviorSubject(client);
    const message$ = from(messages);
    const out$ = message$.pipe(broadcast(ws$));
    out$.subscribe(null, console.log, () => {
      expect(client.send.callCount).to.equal(2);
      expect(client.send.getCall(0).args[0]).to.equal(JSON.stringify(messages[0]));
      expect(client.send.getCall(1).args[0]).to.equal(JSON.stringify(messages[1]));
      done();
    });
  });

  it('should generate correct subscriptions and pass output through from websocket', marbles(m => {
    const startTime = new Date();
    const client = {send: sinon.spy()};
    const ws$ = m.cold('0-1(23)4-5|', {
      0: [client, {data: {startTime}, type: CLIENT_CREATE}],
      1: [client, {type: 'notaconnection'}],
      2: [client, {data: {startTime}, type: NEW_MESSAGE}],
      3: [client, {data: {startTime}, type: 'notaconnection'}],
      4: [client, {type: 'notaconnection', type: NEW_MESSAGE}],
      5: [client, {data: {startTime}, type: RECONNECT_DONE}],
    });
    const message$ = m.cold('--01---2(3|)', [
      {text: 'bar'},
      {text: 'whatever'},
      {text: 'sup'},
      {text: 'guten tag'},
    ]);
    const actual$ = message$.pipe(broadcast(ws$));
    m.expect(actual$).toBeObservable(ws$);
    m.expect(message$).toHaveSubscriptions('^-------!');
    m.expect(ws$).toHaveSubscriptions('^---------!');
  }));

  // it('should use the provided serializer', marbles(m => {
  //       const startTime = new Date();
  //   const client = {send: sinon.spy()};
  //   const error = new Error('broadcast() operator takes an Observable as its first parameter.');
  //   const input$ = m.cold('0-1(23)4-5|', {
  //     0: [client, {data: {startTime}, type: CLIENT_CREATE}],
  //     1: [client, {type: 'notaconnection'}],
  //     2: [client, {data: {startTime}, type: NEW_MESSAGE}],
  //     3: [client, {data: {startTime}, type: 'notaconnection'}],
  //     4: [client, {type: 'notaconnection', type: NEW_MESSAGE}],
  //     5: [client, {data: {startTime}, type: RECONNECT_DONE}],
  //   });
  //   const messageToSend$ = m.cold('--01---2(3|)', [
  //     {text: 'bar'},
  //     {text: 'whatever'},
  //     {text: 'sup'},
  //     {text: 'guten tag'},
  //   ]);
  //   const params = {messageToSend$};
  //   const actual$ = input$.pipe(broadcast(), takeLast(1));
  //   m.expect(input$).toHaveSubscriptions();
  //   m.expect(message$).toHaveSubscriptions('^----');
  // }));
});
