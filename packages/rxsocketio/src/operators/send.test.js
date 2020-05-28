import {expect} from 'chai';
import {marbles} from 'rxjs-marbles/mocha';
import sinon from 'sinon';
import {from,of} from 'rxjs';

import send, {testExports} from './send';
const {sendWithTransactions} = testExports;

describe('send', () => {
  it('should emit basic messages properly', done => {
    let _socket = {emit: sinon.stub().returns(true)};
    _socket.binary = () => _socket;
    _socket.compress = () => _socket;
    const message$ = from([
      {body: 'yo'},
      {body: 'sup'},
      {body: 'smell you later'},
    ]);
    const io$ = of(
      [_socket, {type: 'connections/CONNECT', data: {}}]
    );
    const params = {io$};
    const actual$ = message$.pipe(send(params));
    actual$.subscribe(null, null, () => {
      expect(_socket.emit.callCount).to.equal(3);
      expect(_socket.emit.firstCall.args).to.deep.equal([
        'message',
        {body: 'yo'},
      ]);
      done();
    });
  });

  it('should create correct output observable', marbles(m => {
    let _socket = {emit: sinon.stub().returns(true),};
    _socket.binary = () => _socket;
    _socket.compress = () => _socket;
    const message$ = m.cold('--012|', {
      0: {body: 'yo'},
      1: {body: 'sup'},
      2: {body: 'smell you later'},
    });
    const io$ = m.cold('-0----', {
      0: [_socket, {type: 'connections/CONNECT', data: {}}]
    });
    const params = {io$};
    const actual$ = message$.pipe(send(params));
    const expected$ = m.cold('------');
    m.expect(actual$).toBeObservable(expected$);
  }));

  it('should emit messages to custom topics properly', done => {
    let _socket = {emit: sinon.stub().returns(true)};
    _socket.binary = () => _socket;
    _socket.compress = () => _socket;
    const message$ = from([
      {body: 'yo'},
      {body: 'sup', topic: 'another'},
      {body: 'smell you later', topic: 'foobar'},
    ]);
    const io$ = of(
      [_socket, {type: 'connections/CONNECT', data: {}}]
    );
    const params = {io$};
    const actual$ = message$.pipe(send(params));
    actual$.subscribe(null, null, () => {
      expect(_socket.emit.callCount).to.equal(3);
      expect(_socket.emit.getCall(2).args).to.deep.equal([
        'foobar',
        {body: 'smell you later'},
      ]);
      done();
    });
  });

  it('should emit binary messages properly', done => {
    let _socket = {emit: sinon.stub().returns(true)};
    _socket.binary = () => _socket;
    _socket.compress = () => _socket;
    const blob = new ArrayBuffer();
    const message$ = from([
      {topic: 'audio-chunk', body: 'onefinebody', binary: blob},
      {topic: 'audio-chunk', body: 'another', binary: blob},
    ]);
    const io$ = of(
      [_socket, {type: 'connections/CONNECT', data: {}}]
    );
    const params = {io$};
    const actual$ = message$.pipe(send(params));
    actual$.subscribe(null, null, () => {
      expect(_socket.emit.callCount).to.equal(2);
      expect(_socket.emit.firstCall.args).to.deep.equal([
        'audio-chunk',
        {body: 'onefinebody'},
        blob
      ]);
      done();
    });
  });

  it('should handle failures when sendWithTransactions is true', done => {
    const onData = sinon.spy();
    const onError = sinon.spy();
    const message = {body: 'one fine body'};
    const response = [];
    let socket = {emit: sinon.stub(),};
    socket.binary = () => socket;
    socket.compress = () => socket;
    const options = {
      shouldWaitForConfirmation: false,
      shouldRetry: false,
      maxTimeout: 10000,
      validateResponse: responseArgs => !!responseArgs[0],
      retryDelay: 10000,
      retryCount: 3,
      retryFunction: null,
    };
    const result$ = sendWithTransactions({message, socket, ...options});
    result$.subscribe(onData, err => {
      expect(socket.emit.calledOnce).to.be.true;
      expect(onData.called).to.be.false;
      expect(err).to.be.an('error');
      done();
    });
    socket.emit.yield(null);
  });
});
