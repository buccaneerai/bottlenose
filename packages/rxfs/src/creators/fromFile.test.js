import fs from 'fs';
import path from 'path';
import {EventEmitter} from 'events';
import {expect} from 'chai';
import sinon from 'sinon';
// import {marbles} from 'rxjs-marbles/mocha';
import {scan,takeLast} from 'rxjs/operators';

import fromFile from './fromFile';

const sampleFilePath = path.resolve(__dirname, '../../demo/fake-csv.csv');
const expectedFileString = `"name","dangerLevel"
"Blackbeard",8
"Sparrow",2
"Crunch",1
"Hook",6
"Morgan",9
"Drake",8`;

describe('creators.fromFile', () => {
  it('should read a real file properly', done => {
    expect(2);
    const onData = sinon.spy();
    const onError = sinon.spy();
    const output$ = fromFile({filePath: sampleFilePath}).pipe(
      scan((content, buffer) => `${content}${buffer.toString()}`, ''),
      takeLast(1)
    );
    output$.subscribe(onData, onError, () => {
      expect(onError.callCount).to.equal(0);
      expect(onData.firstCall.args[0]).to.equal(expectedFileString);
      done();
    });
  }).timeout(2000);

  it('should call readstream workflows and teardown correctly', done => {
    expect(5);
    const onData = sinon.spy();
    const onError = sinon.spy();
    const emitter = new EventEmitter();
    const readStreamStub = {
      destroy: sinon.spy(),
      emit: emitter.emit,
      on: emitter.on,
    };
    const output$ = fromFile({
      filePath: sampleFilePath,
      _createReadStream: sinon.stub().returns(readStreamStub),
    });
    output$.subscribe(onData, onError, () => {
      expect(onError.called).to.be.false;
      expect(onData.callCount).to.equal(2);
      expect(onData.getCall(0).args[0]).to.deep.equal(Buffer.from('foo'));
      expect(onData.getCall(1).args[0]).to.deep.equal(Buffer.from('bar'));
      // expect(readStreamStub.destroy.callCount).to.equal(1);
      done();
    });
    readStreamStub.emit('data', Buffer.from('foo'));
    readStreamStub.emit('data', Buffer.from('bar'));
    readStreamStub.emit('close', '');
  }).timeout(2000);
});
