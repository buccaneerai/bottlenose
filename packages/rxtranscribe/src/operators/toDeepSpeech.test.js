import {expect} from 'chai';
import sinon from 'sinon';
import {marbles} from 'rxjs-marbles/mocha';
import {from,of} from 'rxjs';
import {take} from 'rxjs/operators';
import {fromFile} from '@bottlenose/rxfs';

import toDeepSpeech, {testExports} from './toDeepSpeech';
const {createModel, transcribe} = testExports;

describe('operators.toDeepSpeech', () => {
  it('should call its workflows correctly', done => {
    const onData = sinon.spy();
    const onError = sinon.spy();
    // const windowOperator = sinon.stub().returns(of(['011011', '110110']));
    const sttOperator = sinon.stub().returns(from(['hello world', 'byeee']));
    const params = {
      modelDir: 'foobar',
      _createModel: sinon.stub().returns(),
      // _buffer: sinon.stub().returns(windowOperator),
      _transcribe: sinon.stub().returns(sttOperator),
    };
    const fileChunk$ = from(['011011', '110110']);
    const out$ = fileChunk$.pipe(toDeepSpeech(params));
    out$.subscribe(onData, onError, () => {
      expect(onError.called).to.be.false;
      expect(params._createModel.callCount).to.equal(1);
      expect(params._createModel.getCall(0).args[0]).to.deep.equal({
        modelDir: params.modelDir
      });
      // expect(windowOperator.callCount).to.equal(1);
      expect(sttOperator.callCount).to.equal(1);
      expect(onData.callCount).to.equal(3);
      expect(onData.getCall(2).args[0]).to.deep.equal({content: 'byeee'});
      done();
    });
  });

  it('should feed audio chunks to DeepSpeech model', done => {
    const onData = sinon.spy();
    const onError = sinon.spy();
    const fileChunks$ = of(['1010101011', '1100111011']);
    const modelOutput = 'the quick brown fox jumps over the lazy dog';
    const modelStream = 'stream-object';
    const model = {
      feedAudioContent: sinon.stub().returns(modelOutput),
      createStream: sinon.stub().returns(modelStream),
      finishStream: sinon.stub().returns(modelOutput),
    };
    const params = {
      model,
      sampleRate: 16000
    };
    const out$ = fileChunks$.pipe(transcribe(params));
    out$.subscribe(onData, onError, () => {
      expect(onError.called).to.be.false;
      expect(model.createStream.calledOnce).to.be.true;
      expect(model.feedAudioContent.callCount).to.equal(2);
      expect(model.finishStream.calledOnce).to.be.true;
      expect(onData.callCount).to.equal(1);
      done();
    });
  });

  it('should tranform DeepSpeech output to correct output format', marbles(m => {
    const input$ = m.cold('--0-|', ['1010101011']);
    const modelOutput = 'the quick brown fox jumps over the lazy dog';
    const modelStream = 'stream-object';
    const model = {
      feedAudioContent: sinon.stub().returns(modelOutput),
      createStream: sinon.stub().returns(modelStream),
      finishStream: sinon.stub().returns(modelOutput),
    };
    const params = {
      modelDir: '/path/to/model',
      _createModel: sinon.stub().returns(model)
    };
    const out$ = input$.pipe(toDeepSpeech(params));
    const expected$ = m.cold('----(012345678|)', [
      {content: 'the'},
      {content: 'quick'},
      {content: 'brown'},
      {content: 'fox'},
      {content: 'jumps'},
      {content: 'over'},
      {content: 'the'},
      {content: 'lazy'},
      {content: 'dog'},
    ]);
    m.expect(out$).toBeObservable(expected$);
  }));
});
