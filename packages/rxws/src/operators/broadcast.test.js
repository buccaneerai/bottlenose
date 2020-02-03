import {expect} from 'chai';
import sinon from 'sinon';
import {BehaviorSubject,from,of} from 'rxjs';
import {takeLast} from 'rxjs/operators';
import {marbles} from 'rxjs-marbles/mocha';

import broadcast from './broadcast';
import { CLIENT_CREATE, RECONNECT_DONE, NEW_MESSAGE } from '../internals/actions';

describe('broadcast operator', () => {
  it('should throw an error when passed a first parameter that is not an observable', marbles(m => {
    const startTime = new Date();
    const client = {send: sinon.spy()};
    const error = new Error('broadcast() operator takes an Observable as its first parameter.');
    const input$ = m.cold('0-1(23)4-5|', {
      0: [client, {data: {startTime}, type: CLIENT_CREATE}],
      1: [client, {type: 'notaconnection'}],
      2: [client, {data: {startTime}, type: NEW_MESSAGE}],
      3: [client, {data: {startTime}, type: 'notaconnection'}],
      4: [client, {type: 'notaconnection', type: NEW_MESSAGE}],
      5: [client, {data: {startTime}, type: RECONNECT_DONE}],
    });
    const actual$ = input$.pipe(broadcast('foobar'), takeLast(1));
    m.expect(actual$).toBeObservable(m.cold('----------#', null, error));
  }));

  it('should call the .send() method on each item', done => {
    const client = {send: sinon.spy()};
    const ws$ = of([client, {type: 'SOMEACTION', data: {foo: 'bar'}}]);
    const messages = [{text: 'hola'}, {text: 'guten tag'}];
    ws$.client = new BehaviorSubject(client);
    const message$ = from(messages);
    const send$ = ws$.pipe(broadcast(message$));
    send$.subscribe(null, console.log, () => {
      expect(client.send.callCount).to.equal(2);
      expect(client.send.getCall(0).args[0]).to.equal(JSON.stringify(messages[0]));
      expect(client.send.getCall(1).args[0]).to.equal(JSON.stringify(messages[1]));
      done();
    });
  });
});
