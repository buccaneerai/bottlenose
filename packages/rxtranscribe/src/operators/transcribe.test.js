import fs from 'fs';
import path from 'path';
import {expect} from 'chai';
import sinon from 'sinon';
import {from,Observable,of} from 'rxjs';
import {map,mapTo,take,tap} from 'rxjs/operators';
import {marbles} from 'rxjs-marbles/mocha';

import transcribe from './transcribe';

const audioSampleFilePath = path.resolve(__dirname, '../../demo/sample-audio.mp3');

describe('operators.transcribe', () => {
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
      transcribe(params)
    );
    const expected$ = m.cold('-0--1---2|', [
      JSON.stringify({foo: 'some json'}),
      JSON.stringify({foo: 'some json'}),
      JSON.stringify({foo: 'some json'}),
    ])
    m.expect(actual$).toBeObservable(expected$);
    expect(params._getPresignedUrl.calledOnce).to.be.true;
    expect(params._getPresignedUrl.getCall(0).args[0]).to.deep.equal({
      region: 'us-east-1',
      accessKeyId: params.accessKeyId,
      secretAccessKey: params.secretAccessKey,
    });
    // expect(params._convertAudioToBinaryMessage.callCount).to.equal(3);
    // expect(params._convertAudioToBinaryMessage.getCall(2).args[0]).to.deep.equal(Buffer.from('lastfoobar', 'base64'))
    // expect(params._conduit.callCount).to.equal(1);
  }));

  it('should produce correct output when given a valid input stream', done => {
    const params = {
      accessKeyId: 'fakeaccesskey',
      secretAccessKey: 'fakesecretkey',
      _conduit: sinon.stub().returns(source$ => source$.pipe(map(data => data))),
      _getPresignedUrl: sinon.stub().returns(
        'wss://buccaneer.ai?something'
      ),
    };
    const mp3Stream$ = readFile(audioSampleFilePath).pipe(take(5));
    mp3Stream$.pipe(tap(console.log)).subscribe();
    const transcription$ = mp3Stream$.pipe(
      transcribe(params),
      tap(console.log)
    ).subscribe();
    // const expected$ = m.cold('---------------|');
    // m.expect(transcription$).toBeObservable(expected$);
  });
});
