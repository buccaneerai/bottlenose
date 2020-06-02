import {expect} from 'chai';
import sinon from 'sinon';
import {marbles} from 'rxjs-marbles/mocha';

import io, {testExports} from './io';
const {
  createTopicEmitter,
  createObservableFromSocket,
  handleTopic,
  socketEventReducer,
} = testExports;

describe('io', () => {
  it('should call its workflow correctly', marbles(m => {
    const fakeEvents = [
      {type: 'CREATE', data: {foo: 'bar'}},
      {type: 'SEND_MESSAGE', data: {foo: 'bar'}},
    ];
    const fakeEvent$ = m.cold('--01|', fakeEvents);
    const client = {hi: 'I am a client'};
    const params = {
      url: 'foo',
      socketOptions: {foo: 'bar'},
      _socketIO: sinon.stub().returns(client),
      _createObservableFromSocket: sinon.stub().returns(fakeEvent$),
    };
    const actual$ = io(params);
    expect(params._socketIO.calledOnce).to.be.true;
    expect(params._socketIO.firstCall.args[0]).to.equal(params.url);
    expect(params._socketIO.firstCall.args[1]).to.deep.include({json: true});
    expect(params._createObservableFromSocket.calledOnce).to.be.true;
    const expected$ = m.cold('--01|', fakeEvents.map(e => [client, e]));
    m.expect(actual$).toBeObservable(expected$);
  }));

  it('should return error Observable if url is absent', marbles(m => {
    const errStr = 'io creator requires a url<String>';
    const params = {};
    const actual$ = io(params);
    const expected$ = m.cold('#', null, new Error(errStr));
    m.expect(actual$).toBeObservable(expected$);
  }));

  it('.socketEventReducer should connect events properly', () => {
    const doSomethingStub = sinon.spy();
    const doAnotherThingStub = sinon.spy();
    const client = {on: sinon.stub()};
    const obs = {next: sinon.stub().returns()};
    const reducer = socketEventReducer(client, obs);
    expect(reducer).to.be.a('function');
    const eventHandlers = [
      ['doSomething', doSomethingStub],
      ['doAnotherThing', doAnotherThingStub],
    ];
    const result = eventHandlers.reduce(reducer, undefined);
    client.on.yield(1);
    expect(client.on.callCount).to.equal(2);
    expect(result).to.be.an('undefined');
    expect(doSomethingStub.calledOnce).to.be.true;
    expect(doSomethingStub.firstCall.args[0]).to.equal(1);
    expect(doAnotherThingStub.calledOnce).to.be.true;
  });

  it('.createObservableFromSocket should throw error if topic is on blacklist', marbles(m => {
    const errStr = 'These topics are reserved and cannot be subscribed to: connect,connect_error,connect_timeout,disconnect,reconnect,reconnecting,reconnect_error,reconnect_failed,ping,pong';
    const client = {};
    const topics = ['foobar', 'reconnect'];
    const result$ = createObservableFromSocket(client, topics);
    const expected$ = m.cold('#', null, new Error(errStr));
    m.expect(result$).toBeObservable(expected$);
  }));

  it('.createTopicEmitter should emit correctly to the topic', () => {
    const obs = {next: sinon.spy()};
    const newMessage = sinon.stub().returns({foo: 'bar'});
    const emitter = createTopicEmitter(obs, {newMessage});
    const topicEmitter = emitter('mytopic');
    topicEmitter('1');
    topicEmitter('2');
    expect(obs.next.callCount).to.equal(2);
    expect(newMessage.callCount).to.equal(2);
    expect(newMessage.firstCall.args[0]).to.deep.equal({topic: 'mytopic', message: '1'});
    expect(obs.next.getCall(1).args[0]).to.deep.equal({foo: 'bar'});
  });
});

