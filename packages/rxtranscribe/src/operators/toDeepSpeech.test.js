import {expect} from 'chai';
import sinon from 'sinon';
import {marbles} from 'rxjs-marbles/mocha';
import {from,of} from 'rxjs';
import {mapTo,take} from 'rxjs/operators';
import {fromFile} from '@bottlenose/rxfs';

import toDeepSpeech, {testExports} from './toDeepSpeech';
const {
  createModel,
  standardizeOutput,
  transcribe,
  transcribeChunks,
  // transcriptWordReducer
} = testExports;

const rawDeepSpeechOut = {"transcripts":[{"confidence":-69.76224517822266,"tokens":[{"start_time":0,"timestep":0,"text":"s"},{"start_time":0.019999999552965164,"timestep":1,"text":"o"},{"start_time":0.3199999928474426,"timestep":16,"text":"l"},{"start_time":0.3799999952316284,"timestep":19,"text":"d"},{"start_time":0.4599999785423279,"timestep":23,"text":"i"},{"start_time":0.5199999809265137,"timestep":26,"text":"e"},{"start_time":0.5399999618530273,"timestep":27,"text":"r"},{"start_time":0.6800000071525574,"timestep":34,"text":"s"},{"start_time":1.0399999618530273,"timestep":52,"text":" "},{"start_time":1.059999942779541,"timestep":53,"text":"s"},{"start_time":1.1399999856948853,"timestep":57,"text":"a"},{"start_time":1.159999966621399,"timestep":58,"text":"i"},{"start_time":1.1999999284744263,"timestep":60,"text":"l"},{"start_time":1.3199999332427979,"timestep":66,"text":"o"},{"start_time":1.3399999141693115,"timestep":67,"text":"r"},{"start_time":1.4199999570846558,"timestep":71,"text":"s"},{"start_time":1.459999918937683,"timestep":73,"text":" "},{"start_time":1.4800000190734863,"timestep":74,"text":"a"},{"start_time":1.5799999237060547,"timestep":79,"text":"n"},{"start_time":1.5999999046325684,"timestep":80,"text":"d"},{"start_time":1.6200000047683716,"timestep":81,"text":" "},{"start_time":1.659999966621399,"timestep":83,"text":"a"},{"start_time":1.6999999284744263,"timestep":85,"text":"i"},{"start_time":1.8199999332427979,"timestep":91,"text":"r"},{"start_time":1.8399999141693115,"timestep":92,"text":"m"},{"start_time":1.8799999952316284,"timestep":94,"text":"e"},{"start_time":2.0999999046325684,"timestep":105,"text":"n"},{"start_time":2.1599998474121094,"timestep":108,"text":" "},{"start_time":2.3399999141693115,"timestep":117,"text":"o"},{"start_time":2.440000057220459,"timestep":122,"text":"f"},{"start_time":2.5,"timestep":125,"text":" "},{"start_time":2.5199999809265137,"timestep":126,"text":"t"},{"start_time":2.559999942779541,"timestep":128,"text":"h"},{"start_time":2.5799999237060547,"timestep":129,"text":"e"},{"start_time":2.619999885559082,"timestep":131,"text":" "},{"start_time":2.6599998474121094,"timestep":133,"text":"a"},{"start_time":2.7200000286102295,"timestep":136,"text":"l"},{"start_time":2.7799999713897705,"timestep":139,"text":"l"},{"start_time":2.819999933242798,"timestep":141,"text":"i"},{"start_time":2.879999876022339,"timestep":144,"text":"e"},{"start_time":2.8999998569488525,"timestep":145,"text":"d"},{"start_time":2.9600000381469727,"timestep":148,"text":" "},{"start_time":2.9800000190734863,"timestep":149,"text":"e"},{"start_time":3.0799999237060547,"timestep":154,"text":"x"},{"start_time":3.119999885559082,"timestep":156,"text":"p"},{"start_time":3.1999998092651367,"timestep":160,"text":"e"},{"start_time":3.259999990463257,"timestep":163,"text":"d"},{"start_time":3.299999952316284,"timestep":165,"text":"i"},{"start_time":3.3399999141693115,"timestep":167,"text":"t"},{"start_time":3.379999876022339,"timestep":169,"text":"i"},{"start_time":3.3999998569488525,"timestep":170,"text":"o"},{"start_time":3.43999981880188,"timestep":172,"text":"n"},{"start_time":3.4600000381469727,"timestep":173,"text":"a"},{"start_time":3.5,"timestep":175,"text":"r"},{"start_time":3.5999999046325684,"timestep":180,"text":"y"},{"start_time":3.679999828338623,"timestep":184,"text":" "},{"start_time":3.759999990463257,"timestep":188,"text":"f"},{"start_time":3.859999895095825,"timestep":193,"text":"o"},{"start_time":3.919999837875366,"timestep":196,"text":"r"},{"start_time":3.9800000190734863,"timestep":199,"text":"c"},{"start_time":4.059999942779541,"timestep":203,"text":"e"},{"start_time":4.079999923706055,"timestep":204,"text":" "},{"start_time":5.339999675750732,"timestep":267,"text":"y"},{"start_time":5.359999656677246,"timestep":268,"text":"o"},{"start_time":5.460000038146973,"timestep":273,"text":"u"},{"start_time":5.5,"timestep":275,"text":" "},{"start_time":5.599999904632568,"timestep":280,"text":"a"},{"start_time":5.679999828338623,"timestep":284,"text":"r"},{"start_time":5.71999979019165,"timestep":286,"text":"e"},{"start_time":5.739999771118164,"timestep":287,"text":" "},{"start_time":5.759999752044678,"timestep":288,"text":"a"},{"start_time":5.799999713897705,"timestep":290,"text":"b"},{"start_time":5.859999656677246,"timestep":293,"text":"o"},{"start_time":5.900000095367432,"timestep":295,"text":"u"},{"start_time":5.940000057220459,"timestep":297,"text":"t"},{"start_time":5.980000019073486,"timestep":299,"text":" "},{"start_time":6.019999980926514,"timestep":301,"text":"t"},{"start_time":6.059999942779541,"timestep":303,"text":"o"}]}]};
const simpleOutput = {"transcripts":[{"confidence":-69.76224517822266,"words":[{"text":"soldiers","startTime":0.019999999552965164,"endTime":1.0399999618530273},{"text":"sailors","startTime":1.059999942779541,"endTime":1.459999918937683},{"text":"and","startTime":1.4800000190734863,"endTime":1.6200000047683716},{"text":"airmen","startTime":1.659999966621399,"endTime":2.1599998474121094},{"text":"of","startTime":2.3399999141693115,"endTime":2.5},{"text":"the","startTime":2.5199999809265137,"endTime":2.619999885559082},{"text":"allied","startTime":2.6599998474121094,"endTime":2.9600000381469727},{"text":"expeditionary","startTime":2.9800000190734863,"endTime":3.679999828338623},{"text":"force","startTime":3.759999990463257,"endTime":4.079999923706055},{"text":"you","startTime":5.339999675750732,"endTime":5.5},{"text":"are","startTime":5.599999904632568,"endTime":5.739999771118164},{"text":"about","startTime":5.759999752044678,"endTime":5.980000019073486}]}]};

describe('operators.toDeepSpeech', () => {
  it('should throw error if modelDir is missing', marbles(m => {
    const input$ = m.cold('--0-|', ['foo']);
    const op = toDeepSpeech({
      modelDir: null,
      _createModel: () => 'foo',
      _transcribe: () => obs$ => obs$.pipe(mapTo(simpleOutput)),
    });
    const actual$ = input$.pipe(op);
    const expected$ = m.cold(
      '#',
      null,
      new Error('modelDir<String> is required for toDeepSpeech operator')
    );
    m.expect(actual$).toBeObservable(expected$);
  }));

  it('should deliver simplified output if rawOutput option is false', marbles(m => {
    const input$ = m.cold('--0-|', ['foo']);
    const op = toDeepSpeech({
      modelDir: 'foo',
      rawOutput: false,
      _createModel: () => 'foo',
      _transcribe: () => obs$ => obs$.pipe(mapTo(rawDeepSpeechOut)),
    });
    const actual$ = input$.pipe(op);
    const expected$ = m.cold('----(0|)', [simpleOutput]);
    m.expect(actual$).toBeObservable(expected$);
  }));

  it('should deliver raw output if rawOutput option is true', marbles(m => {
    const input$ = m.cold('--0-|', ['foo']);
    const op = toDeepSpeech({
      modelDir: 'foo',
      rawOutput: true,
      _createModel: () => 'foo',
      _transcribe: () => obs$ => obs$.pipe(mapTo(rawDeepSpeechOut)),
    });
    const actual$ = input$.pipe(op);
    const expected$ = m.cold('----(0|)', [rawDeepSpeechOut]);
    m.expect(actual$).toBeObservable(expected$);
  }));

  it('should standardizeOutput correctly', () => {
    const actual = standardizeOutput()(rawDeepSpeechOut);
    const expected = simpleOutput;
    expect(actual).to.deep.equal(expected);
  });
});

// describe('operators.toDeepSpeech', () => {
//   it('should call its workflows correctly', done => {
//     const onData = sinon.spy();
//     const onError = sinon.spy();
//     // const windowOperator = sinon.stub().returns(of(['011011', '110110']));
//     const sttOperator = sinon.stub().returns(from(['hello world', 'byeee']));
//     const params = {
//       modelDir: 'foobar',
//       _createModel: sinon.stub().returns(),
//       // _buffer: sinon.stub().returns(windowOperator),
//       _transcribe: sinon.stub().returns(sttOperator),
//     };
//     const fileChunk$ = from(['011011', '110110']);
//     const out$ = fileChunk$.pipe(toDeepSpeech(params));
//     out$.subscribe(onData, onError, () => {
//       expect(onError.called).to.be.false;
//       expect(params._createModel.callCount).to.equal(1);
//       expect(params._createModel.getCall(0).args[0]).to.deep.equal({
//         modelDir: params.modelDir
//       });
//       // expect(windowOperator.callCount).to.equal(1);
//       expect(sttOperator.callCount).to.equal(1);
//       expect(onData.callCount).to.equal(3);
//       expect(onData.getCall(2).args[0]).to.deep.equal({content: 'byeee'});
//       done();
//     });
//   });

//   it('should feed audio chunks to DeepSpeech model', done => {
//     const onData = sinon.spy();
//     const onError = sinon.spy();
//     const fileChunks$ = of(['1010101011', '1100111011']);
//     const modelOutput = 'the quick brown fox jumps over the lazy dog';
//     const modelStream = 'stream-object';
//     const model = {
//       feedAudioContent: sinon.stub().returns(modelOutput),
//       createStream: sinon.stub().returns(modelStream),
//       finishStream: sinon.stub().returns(modelOutput),
//     };
//     const params = {
//       model,
//       sampleRate: 16000
//     };
//     const out$ = fileChunks$.pipe(transcribe(params));
//     out$.subscribe(onData, onError, () => {
//       expect(onError.called).to.be.false;
//       expect(model.createStream.calledOnce).to.be.true;
//       expect(model.feedAudioContent.callCount).to.equal(2);
//       expect(model.finishStream.calledOnce).to.be.true;
//       expect(onData.callCount).to.equal(1);
//       done();
//     });
//   });

//   it('should tranform DeepSpeech output to correct output format', marbles(m => {
//     const input$ = m.cold('--0-|', [Buffer.from('1010101011')]);
//     const modelOutput = 'the quick brown fox jumps over the lazy dog';
//     const modelStream = 'stream-object';
//     const model = {
//       feedAudioContent: sinon.stub().returns(modelOutput),
//       createStream: sinon.stub().returns(modelStream),
//       finishStream: sinon.stub().returns(modelOutput),
//     };
//     const params = {
//       modelDir: '/path/to/model',
//       _createModel: sinon.stub().returns(model)
//     };
//     const out$ = input$.pipe(toDeepSpeech(params));
//     const expected$ = m.cold('----(012345678|)', [
//       {content: 'the'},
//       {content: 'quick'},
//       {content: 'brown'},
//       {content: 'fox'},
//       {content: 'jumps'},
//       {content: 'over'},
//       {content: 'the'},
//       {content: 'lazy'},
//       {content: 'dog'},
//     ]);
//     m.expect(out$).toBeObservable(expected$);
//   }));
// });
