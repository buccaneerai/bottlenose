import {expect} from 'chai';
import sinon from 'sinon';
import {marbles} from 'rxjs-marbles/mocha';
import {from,of} from 'rxjs';
import {take} from 'rxjs/operators';
import {fromFile} from '@bottlenose/rxfs';

import toDeepSpeech, {testExports} from './toDeepSpeech';
const {
  createModel,
  ingestAudioToModel,
  windowAudioChunks
} = testExports;

describe('operators.toDeepSpeech', () => {
  it('should call its workflows correctly', done => {
    const onData = sinon.spy();
    const onError = sinon.spy();
    const windowOperator = sinon.stub().returns(of(['011011', '110110']));
    const sttOperator = sinon.stub().returns(from(['hello world', 'byeee']));
    const params = {
      modelDir: 'foobar',
      _createModel: sinon.stub().returns(),
      _windowAudioChunks: sinon.stub().returns(windowOperator),
      _ingestAudioToModel: sinon.stub().returns(sttOperator),
    };
    const fileChunk$ = from(['011011', '110110']);
    const out$ = fileChunk$.pipe(toDeepSpeech(params));
    out$.subscribe(onData, onError, () => {
      expect(onError.called).to.be.false;
      expect(params._createModel.callCount).to.equal(1);
      expect(params._createModel.getCall(0).args[0]).to.deep.equal({
        modelDir: params.modelDir
      });
      expect(windowOperator.callCount).to.equal(1);
      expect(sttOperator.callCount).to.equal(1);
      expect(onData.callCount).to.equal(2);
      expect(onData.getCall(1).args[0]).to.equal('byeee');
      done();
    });
  });

  it('should feed audio chunks to DeepSpeech model', done => {
    const onData = sinon.spy();
    const onError = sinon.spy();
    const fileChunks$ = of(['1010101011', '1100111011']);
    const modelOutput = 'the quick brown fox jumps over the lazy dog';
    const modelStream = 'stream-object';
    const params = {
      model: {
        feedAudioContent: sinon.stub().returns(modelOutput),
        createStream: sinon.stub().returns(modelStream),
        finishStream: sinon.stub().returns(modelOutput),
      },
      sampleRate: 16000,
    };
    const out$ = fileChunks$.pipe(ingestAudioToModel(params));
    out$.subscribe(onData, onError, () => {
      expect(onError.called).to.be.false;
      expect(params.model.createStream.calledOnce).to.be.true;
      expect(params.model.feedAudioContent.callCount).to.equal(2);
      expect(params.model.finishStream.calledOnce).to.be.true;
      expect(onData.callCount).to.equal(1);
      expect(onData.getCall(0).args[0]).to.equal(modelOutput);
      done();
    });
  });
});
