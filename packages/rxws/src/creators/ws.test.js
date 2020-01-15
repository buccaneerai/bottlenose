import Emitter from 'events';
import {expect} from 'chai';
import sinon from 'sinon';
import { Subject, timer } from 'rxjs';
import { tap } from 'rxjs/operators';
import { marbles } from 'rxjs-marbles/mocha';

import ws from './ws';

function stubActions() {
  return {
    getClient: sinon.stub().returns({type: 'GETCLIENT'}),
    createClient: sinon.stub().returns({type: 'CREATECLIENT'}),
    socketConnect: sinon.stub().returns({type: 'CONNECT'}),
    disconnect: sinon.stub().returns({type: 'DISCONNECT'}),
    socketError: sinon.stub().returns({type: 'SOCKET_ERR'}),
    newMessage: sinon.stub().returns({type: 'NEW_MESSAGE'}),
  };
}

describe('ws', () => {
  // it('should react to websocket events correctly and stop$ when sent stop$ event', done => {
  //   const dataHandler = sinon.spy();
  //   const errorHandler = sinon.spy();
  //   const _actions = stubActions();
  //   const stop$ = new Subject();
  //   const emitter = new Emitter();
  //   let fakeSocket = {};
  //   const params = {
  //     _actions,
  //     _createSocket: () => sinon.stub().returns(fakeSocket),
  //     stop$,
  //     url: 'wss://mysite.com',
  //     clientInterval: 1,
  //   };
  //   const ws$ = ws(params);
  //   ws$.subscribe(dataHandler, console.log, () => {
  //     expect(dataHandler.getCall(0).args[0][1]).to.deep.equal({type: 'CREATECLIENT'});
  //     expect(dataHandler.getCall(1).args[0][1]).to.deep.equal({type: 'CONNECT'});
  //     expect(dataHandler.getCall(2).args[0][1]).to.deep.equal({type: 'NEW_MESSAGE'});
  //     expect(dataHandler.getCall(3).args[0][1]).to.deep.equal({type: 'NEW_MESSAGE'});
  //     expect(dataHandler.getCall(4).args[0][1]).to.deep.equal({type: 'SOCKET_ERR'});
  //     expect(dataHandler.getCall(5).args[0][1]).to.deep.equal({type: 'DISCONNECT'});
  //     done();
  //   });
  //   fakeSocket.onopen();
  //   fakeSocket.onmessage({text: 'firstmessage'});
  //   fakeSocket.onmessage({text: 'secondmessage'});
  //   fakeSocket.onerror(new Error('fake error'));
  //   fakeSocket.onclose('close');
  //   stop$.next('stopnowplease');
  // });
});
