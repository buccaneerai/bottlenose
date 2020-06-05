import {expect} from 'chai';
import sinon from 'sinon';
import {marbles} from 'rxjs-marbles/mocha';
import {of} from 'rxjs';
import {mapTo} from 'rxjs/operators';

import { CLIENT_CREATE, RECONNECT_DONE, NEW_MESSAGE } from '../internals/actions';
import conduit, {testExports} from './conduit';

const {createMessageBuffer} = testExports;

describe('operators.conduit', () => {
  it('should create a websocket, subscribe to it and return messages from socket', marbles(m => {
    const client = {send: sinon.spy(), readyState: 1};
    const startTime = new Date();
    const ws$ = m.cold('0-1(23)4-5', {
      0: [{...client, readyState: 0}, {data: {startTime}, type: CLIENT_CREATE}],
      1: [{...client, readyState: 0}, {type: 'notaconnection'}],
      2: [client, {type: NEW_MESSAGE, data: {startTime, message: {data: JSON.stringify({text: 'hello'})}}}],
      3: [client, {data: {startTime}, type: 'notaconnection'}],
      4: [client, {type: NEW_MESSAGE, data: {startTime, message: {data: JSON.stringify({text: 'aloha'})}}}],
      5: [client, {data: {startTime}, type: RECONNECT_DONE}],
    });
    const messageIn$ = m.cold('--01---2(3)', [
      {text: 'bar'},
      {text: 'whatever'},
      {text: 'sup'},
      {text: 'guten tag'},
    ]);
    const params = {
      url: 'wss://fake.buccaneer.ai:883',
      _ws: () => ws$,
    };
    const out$ = messageIn$.pipe(conduit(params));
    m.expect(out$).toBeObservable('---0---1--', {
      0: {text:'hello'},
      1: {text: 'aloha'},
    });
    m.expect(ws$).toHaveSubscriptions('^---------');
    m.expect(messageIn$).toHaveSubscriptions('^-------');
  }));

  it('should buffer messages before the socket\'s initial connection is established', marbles(m => {
    const client = {send: sinon.spy(), readyState: 1};
    const startTime = new Date();
    const ws$ = m.cold('--234--7', {
      2: [{...client, readyState: 0}, {data: {startTime}, type: CLIENT_CREATE}],
      3: [{...client, readyState: 0}, {data: {startTime}, type: 'notaconnection'}],
      4: [client, {type: NEW_MESSAGE, data: {startTime, message: {data: JSON.stringify({text: 'aloha'})}}}],
      7: [client, {type: NEW_MESSAGE, data: {startTime, message: {data: JSON.stringify({text: 'hallo'})}}}],
    });
    const messageIn$ = m.cold('0123--', {
      0: {text: 'tag'},
      1: {text: 'sup'},
      2: {text: 'bonjour'},
      3: {text: 'hola'},
      // 5: {text: 'aloha'},
    });
    const out$ = messageIn$.pipe(createMessageBuffer(ws$));
    const expected$ = m.cold('----(0123)', {
      0: {text: 'tag'},
      1: {text: 'sup'},
      2: {text: 'bonjour'},
      3: {text: 'hola'},
    });
    m.expect(out$).toBeObservable(expected$);
    m.expect(messageIn$).toHaveSubscriptions('^-----');
    m.expect(ws$).toHaveSubscriptions('^-------');
  }));

  it('should buffer messages when socket is disconnected', marbles(m => {
    const client = {send: sinon.spy(), readyState: 1};
    const startTime = new Date();
    const ws$ = m.cold('01-34--7', {
      0: [client, {data: {startTime}, type: CLIENT_CREATE}],
      1: [{...client, readyState: 2}, {type: NEW_MESSAGE, data: {startTime, message: {data: JSON.stringify({text: 'hello'})}}}],
      3: [{...client, readyState: 3}, {data: {startTime}, type: 'notaconnection'}],
      4: [client, {type: NEW_MESSAGE, data: {startTime, message: {data: JSON.stringify({text: 'aloha'})}}}],
      7: [client, {type: NEW_MESSAGE, data: {startTime, message: {data: JSON.stringify({text: 'aloha'})}}}],
    });
    const messageIn$ = m.cold('0123-5', {
      0: {text: 'tag'},
      1: {text: 'sup'},
      2: {text: 'bonjour'},
      3: {text: 'hola'},
      5: {text: 'aloha'},
    });
    const out$ = messageIn$.pipe(createMessageBuffer(ws$));
    const expected$ = m.cold('----(123)', {
      1: {text: 'sup'},
      2: {text: 'bonjour'},
      3: {text: 'hola'},
    });
    m.expect(out$).toBeObservable(expected$);
    m.expect(messageIn$).toHaveSubscriptions('^-----');
    m.expect(ws$).toHaveSubscriptions('^-------');
  }));

  it('should throw an error if no URL is provided', marbles(m => {
    const error = new Error('conduit operator requires a {url<String>}');
    const params = {url: null};
    const messageIn$ = m.cold('--|');
    const out$ = messageIn$.pipe(conduit(params));
    m.expect(out$).toBeObservable('#', null, error);
  }));

  it('should default to using the JSON.stringify and JSON.parse serializer/deserializer', marbles(m => {
    const messageIn$ = m.cold('--|');
    const params = {
      url: 'wss:fake.buccaneer.ai:883',
      _ws: () => m.cold('----|'),
      _send: sinon.stub().returns(() => of()),
      _consume: sinon.stub().returns(() => of()),
    };
    const actual$ = messageIn$.pipe(conduit(params));
    expect(params._send.calledOnce).to.be.true;
    expect(params._send.firstCall.args[1]).to.equal(JSON.stringify);
    expect(params._consume.calledOnce).to.be.true;
    expect(params._consume.firstCall.args[0]).to.equal(JSON.parse);
  }));

  // it('should broadcast messages to the socket', marbles(m => {
  //   const client = {send: sinon.spy()};
  //   const startTime = new Date();
  //   const ws$ = m.cold('0-1(23)4-5|', {
  //     0: [client, {data: {startTime}, type: CLIENT_CREATE}],
  //     1: [client, {type: 'notaconnection'}],
  //     2: [client, {type: NEW_MESSAGE, data: {startTime, message: {data: JSON.stringify({text: 'hello'})}}}],
  //     3: [client, {data: {startTime}, type: 'notaconnection'}],
  //     4: [client, {type: NEW_MESSAGE, data: {startTime, message: {data: JSON.stringify({text: 'aloha'})}}}],
  //     5: [client, {data: {startTime}, type: RECONNECT_DONE}],
  //   });
  //   const messageIn$ = m.cold('--01---2(3|)', [
  //     {text: 'bar'},
  //     {text: 'whatever'},
  //     {text: 'sup'},
  //     {text: 'guten tag'},
  //   ]);
  //   const params = {
  //     url: 'wss://fake.buccaneer.ai:883',
  //     _ws: () => ws$,
  //     _broadcast: () =>
  //   };
  //   const out$ = messageIn$.pipe(conduit(params));
  //   m.expect(out$).toBeObservable('---0---1--|', {
  //     0: {text:'hello'},
  //     1: {text: 'aloha'},
  //   });
  //   m.expect(ws$).toHaveSubscriptions('^---------!');
  //   m.expect(messageIn$).toHaveSubscriptions('^-------!');
  // }));
});
