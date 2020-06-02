import {expect} from 'chai';
import {marbles} from 'rxjs-marbles/mocha';
import sinon from 'sinon';
import {of} from 'rxjs';

import * as actions from '../internals/actions';
import conduit, {testExports} from './conduit';
const {createMessageBuffer,passthroughMessageBuffer} = testExports;

describe('conduit', () => {
  it('should stream messages to and from socket.io', marbles(m => {
    const messages = {
      0: {body: 'yar'},
      1: {body: 'arr'},
      2: {body: 'yo'},
      3: {body: 'ho'},
    };
    const message$ = m.cold('0--1--23----|', messages);
    const ioEvent$ = m.cold('012--3--4', {
      0: [{connected: false}, actions.createClient({client: {}})],
      1: [{connected: true}, actions.connect({client: {}})],
      2: [{connected: true}, actions.newMessage({topic: 'message', message: {greeting: 'sup dawg'}})],
      3: [{connected: false}, actions.disconnect({reason: 'bad connection'})],
      4: [{connected: true}, actions.connect({client: {}})],
    });
    const params = {
      url: 'http://twitter.com',
      _send: sinon.stub().returns(in$ => of()),
      // _consume: sinon.stub().returns(() => of()),
      _io: sinon.stub().returns(ioEvent$),
    };
    const actual$ = message$.pipe(conduit(params));
    const expected$ = m.cold(
      '--0------',
      {0: {topic: 'message', message: {greeting: 'sup dawg'}}}
    );
    m.expect(actual$).toBeObservable(expected$);
  }));

  it('should buffer items if socket has not yet connected', marbles(m => {
    const messages = {
      0: {body: 'yar'},
      1: {body: 'arr'},
    };
    const ioEvent$ = m.cold('0--12-3|', {
      0: [{connected: false}, actions.createClient({client: {}})],
      1: [{connected: true}, actions.connect({client: {}})],
      2: [{connected: true}, actions.newMessage({topic: 'message', message: {greeting: 'sup dawg'}})],
      3: [{connected: false}, actions.disconnect({reason: 'bad connection'})]
    });
    const message$ = m.cold('01-----|', messages);
    const actual$ = message$.pipe(createMessageBuffer(ioEvent$));
    const expected$ = m.cold('---(01)|', messages);
    m.expect(actual$).toBeObservable(expected$);
  }));

  it('should buffer subsequent items when the socket disconnects', marbles(m => {
    const messages = {
      0: {body: 'yar'},
      1: {body: 'arr'},
      2: {body: 'yo'},
      3: {body: 'ho'},
    };
    const message$ = m.cold('0--1--23----|', messages);
    const ioEvent$ = m.cold('012--3--4|', {
      0: [{connected: false}, actions.createClient({client: {}})],
      1: [{connected: true}, actions.connect({client: {}})],
      2: [{connected: true}, actions.newMessage({topic: 'message', message: {greeting: 'sup dawg'}})],
      3: [{connected: false}, actions.disconnect({reason: 'bad connection'})],
      4: [{connected: true}, actions.connect({client: {}})],
    });
    const actual$ = message$.pipe(createMessageBuffer(ioEvent$));
    const expected$ = m.cold('-0------(23)|', messages);
    m.expect(actual$).toBeObservable(expected$);
  }));

  it('should passthrough items only when the socket is ready', marbles(m => {
    const messages = {
      0: {body: 'yar'},
      1: {body: 'arr'},
      2: {body: 'yo'},
      3: {body: 'ho'},
    };
    const message$ = m.cold('0--1--23----|', messages);
    const ioEvent$ = m.cold('012--3--4|', {
      0: [{connected: false}, actions.createClient({client: {}})],
      1: [{connected: true}, actions.connect({client: {}})],
      2: [{connected: true}, actions.newMessage({topic: 'message', message: {greeting: 'sup dawg'}})],
      3: [{connected: false}, actions.disconnect({reason: 'bad connection'})],
      4: [{connected: true}, actions.connect({client: {}})],
    });
    const actual$ = message$.pipe(passthroughMessageBuffer(ioEvent$));
    const expected$ = m.cold('---1--------|', messages);
    m.expect(actual$).toBeObservable(expected$);
  }));
});
