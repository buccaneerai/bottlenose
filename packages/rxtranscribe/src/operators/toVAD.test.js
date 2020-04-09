import {expect} from 'chai';
import sinon from 'sinon';
import path from 'path';
import {marbles} from 'rxjs-marbles/mocha';
import {take} from 'rxjs/operators';
import {fromFile} from '@bottlenose/rxfs';

import toVAD from './toVAD';

const audioSampleFilePath = path.resolve(
  __dirname,
  '../../demo/sample-audio.mp3'
);

describe('operators.toVAD', () => {
  it('should handle basic VAD workflow properly', done => {
    expect(3);
    const onData = sinon.spy();
    const onError = sinon.spy();
    const fileChunk$ = fromFile({filePath: audioSampleFilePath}).pipe(
      take(5)
    );
    const vad$ = fileChunk$.pipe(toVAD({}));
    vad$.subscribe(onData, onError, () => {
      expect(onError.called).to.be.false;
      expect(onData.callCount).to.equal(5);
      const item5 = onData.getCall(4).args[0];
      expect(item5[0].byteLength).to.be.a('number'); // check if it is a Buffer
      expect(item5[1]).to.deep.equal({type: 'vad/VOICE'});
      done();
    });
  });
});
