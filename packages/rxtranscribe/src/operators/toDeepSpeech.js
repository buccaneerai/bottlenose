// See: https://github.com/mozilla/DeepSpeech-examples/blob/r0.6/ffmpeg_vad_streaming/README.MD
// https://github.com/mozilla/DeepSpeech-examples/blob/r0.6/web_microphone_websocket/server.js
// https://deepspeech.readthedocs.io/en/v0.6.1/NodeJS-API.html
import DeepSpeech from 'deepspeech';
import {Observable,of,throwError} from 'rxjs';
import {
  bufferCount,
  filter,
  map,
  mergeAll,
  mergeMap,
} from 'rxjs/operators';

// import bufferBetweenSilences from './bufferBetweenSilences';
// import wavTo16BitPcm from '../internals/wavTo16BitPcm';

function createModel({
  modelDir,
  beamWidth = 1024,
  lmAlpha = 0.75,
  lmBeta = 1.85,
  _newModel = (dir, bWidth) => new DeepSpeech.Model(dir, bWidth)
}) {
  let modelPath = `${modelDir}/output_graph.pbmm`;
  let lmPath = `${modelDir}/lm.binary`;
  let triePath = `${modelDir}/trie`;
  let newModel = _newModel(modelPath, beamWidth);
  newModel.enableDecoderWithLM(lmPath, triePath, lmAlpha, lmBeta);
  return newModel;
}

function transcribe({model, sampleRate = 16000}) {
  return bufferedChunks$ => bufferedChunks$.pipe(
    map(chunks => {
    // mergeMap(chunks => new Observable(obs => {
      const modelStream = model.createStream();
      chunks.forEach(chunk => (
        model.feedAudioContent(modelStream, chunk.slice(0, chunk.length / 2))
        // modelStream.feedAudioContent(chunk)
      ));
      // const output = model.finishStream(modelStream);
      // const output = model.stt(chunks[0].slice(0, chunks[0].length / 2));
      const output = model.finishStream(modelStream);
      return output;
      // obs.next(output);
      // return obs.complete();
    }),
    // mergeAll(1),
    // bug in DeepSpeech 0.6 causes silence to be inferred as "i" or "a"
    filter(text => text !== 'i' && text !== 'a')
  );
}

// TODO - this should return confidence levels and timestamps...
const toDeepSpeech = function toDeepSpeech({
  modelDir = process.env.DEEPSPEECH_MODEL_PATH,
  vadOptions = {},
  bufferInterval = 1000,
  sampleRate = 16000,
  codec = 'pcm', // supported: ['pcm']
  // _bufferBetweenSilences = bufferBetweenSilences,
  // _wavTo16BitPcm = wavTo16BitPcm
  _createModel = createModel,
  _transcribe = transcribe,
}) {
  const model = _createModel({modelDir});
  // file chunks should be encoded as 16-bit-integer PCM data
  return fileChunk$ => fileChunk$.pipe(
    mergeMap(chunk => (
      modelDir
      ? of(chunk)
      : throwError(
        new Error('modelDir<String> is required for toDeepSpeech operator')
      )
    )),
    // (
    //   codec === 'wav'
    //   ? _wavTo16BitPcm({sampleRate: model.sampleRate()})
    //   : tap(() => 1) // TODO: would null be okay here?
    // ),
    // _bufferBetweenSilences({vadOptions: {
    //   ...vadOptions,
    //   sampleRate,
    //   bufferInterval
    // }}),
    bufferCount(10), // TODO: remove this when silence buffers are added
    _transcribe({model, sampleRate}),
    map(text => text.split(' ')),
    mergeMap(words => of(...words)),
    map(wordString => ({content: wordString}))
  );
};

export const testExports = {createModel, transcribe};
export default toDeepSpeech;
