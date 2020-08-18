import fs from 'fs';
import path from 'path';
import {expect} from 'chai';
import sinon from 'sinon';
import {from,Observable,of} from 'rxjs';
import {map,mapTo,take,tap} from 'rxjs/operators';
import {marbles} from 'rxjs-marbles/mocha';
import {fromFile} from '@bottlenose/rxfs';

import toAWS from './toAWS';

const audioSampleFilePath = path.resolve(__dirname, '../../demo/samples/sample-audio.mp3');

describe('operators.toAWS', () => {
  it('should properly call its workflow', marbles(m => {
    const input$ = m.cold('-0--1---2|', [
      Buffer.from('foobar', 'base64'),
      Buffer.from('anotherfoobar', 'base64'),
      Buffer.from('lastfoobar', 'base64'),
    ]);
    const params = {
      accessKeyId: 'fakeaccesskey',
      secretAccessKey: 'fakesecretkey',
      _conduit: sinon.stub().returns(source$ => source$.pipe(
        mapTo(JSON.stringify({foo: 'some json'}))
      )),
      _convertAudioToBinaryMessage: sinon.stub().returns(
        Buffer.from('message', 'base64')
      ),
      _getPresignedUrl: sinon.stub().returns(
        'wss://buccaneer.ai?something'
      ),
    };
    const actual$ = input$.pipe(
      toAWS(params)
    );
    const expected$ = m.cold('-0--1---2|', [
      JSON.stringify({foo: 'some json'}),
      JSON.stringify({foo: 'some json'}),
      JSON.stringify({foo: 'some json'}),
    ])
    m.expect(actual$).toBeObservable(expected$);
    m.expect(input$).toHaveSubscriptions('^--------!');
    expect(params._getPresignedUrl.calledOnce).to.be.true;
    expect(params._getPresignedUrl.getCall(0).args[0]).to.deep.equal({
      region: 'us-east-1',
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.secretAccessKey,
      isMedical: false,
      specialty: 'PRIMARYCARE',
      type: 'CONVERSATION',
    });
    // expect(params._convertAudioToBinaryMessage.callCount).to.equal(3);
    // expect(params._convertAudioToBinaryMessage.getCall(2).args[0]).to.deep.equal(Buffer.from('lastfoobar', 'base64'))
    // expect(params._conduit.callCount).to.equal(1);
  }));

  // it('should parse audio and stream to websocket', done => {
  //   const onData = sinon.spy();
  //   const onError = sinon.spy();
  //   const params = {
  //     accessKeyId: 'fakeaccesskey',
  //     secretAccessKey: 'fakesecretkey',
  //     _conduit: sinon.stub().returns(source$ => source$.pipe()),
  //     _getPresignedUrl: sinon.stub().returns(
  //       'wss://buccaneer.ai?something'
  //     ),
  //     _serializer: d => d,
  //     _deserializer: d => d,
  //   };
  //   const mp3Stream$ = fromFile({filePath: audioSampleFilePath}).pipe(
  //     take(2)
  //   );
  //   const transcription$ = mp3Stream$.pipe(
  //     toAWS(params)
  //   );
  //   transcription$.subscribe(onData, onError, () => {
  //     expect(params._conduit.calledOnce).to.be.true;
  //     expect(params._conduit.getCall(0).args[0]).to.deep.equal({
  //       url: 'wss://buccaneer.ai?something',
  //       serializer: params._serializer,
  //       deserializer: params._deserializer,
  //     });
  //     expect(onData.callCount).to.equal(256);
  //     const bufferOut = onData.getCall(0).args[0];
  //     expect(bufferOut.constructor).to.equal(Buffer);
  //     done();
  //   });
  //   transcription$.subscribe();
  // });
});
