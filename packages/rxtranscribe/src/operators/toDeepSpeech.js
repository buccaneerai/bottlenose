// See: https://github.com/mozilla/DeepSpeech-examples/blob/r0.6/ffmpeg_vad_streaming/README.MD
// https://github.com/mozilla/DeepSpeech-examples/blob/r0.6/web_microphone_websocket/server.js
// https://deepspeech.readthedocs.io/en/v0.6.1/NodeJS-API.html
import DeepSpeech from 'deepspeech';
import {of,throwError} from 'rxjs';
import {
  bufferCount,
  filter,
  map,
  mergeMap,
  take,
  tap
} from 'rxjs/operators';

// import bufferBetweenSilences from './bufferBetweenSilences';
// import wavTo16BitPcm from '../internals/wavTo16BitPcm';

function createModel({
  modelPath,
  scorerPath,
  // beamWidth = 1024,
  // lmAlpha = 0.75,
  // lmBeta = 1.85,
  _newModel = (path) => new DeepSpeech.Model(path)
}) {
  // let modelPath = `${modelPath}/deepspeech-0.7.0.pbmm`;
  // let lmPath = `${modelDir}/lm.binary`;
  // let triePath = `${modelDir}/trie`;
  // let newModel = _newModel(modelPath, beamWidth);
  console.log('MODEL_PATH', modelPath);
  let newModel = _newModel(modelPath);
  newModel.enableExternalScorer(scorerPath);
  // newModel.enableDecoderWithLM(lmPath, triePath, lmAlpha, lmBeta);
  return newModel;
}

function transcribe({model, sampleRate = 16000}) {
  return bufferedChunks$ => bufferedChunks$.pipe(
    map(chunks => {
      const modelStream = model.createStream();
      console.log('MODEL_STREAM', modelStream);
      chunks.forEach(chunk => (
        // model.feedAudioContent(modelStream, chunk.slice(0, chunk.length / 2))
        modelStream.feedAudioContent(chunk)
      ));
      // const output = model.finishStream(modelStream);
      // const output = model.stt(chunks[0].slice(0, chunks[0].length / 2));
      const output = model.finishStream(modelStream);
      return output;
    }),
    // bug in DeepSpeech 0.6 causes silence to be inferred as "i" or "a"
    filter(text => text !== 'i' && text !== 'a')
  );
}

// TODO - this should return confidence levels and timestamps...
const toDeepSpeech = function toDeepSpeech({
  modelPath = process.env.DEEPSPEECH_MODEL_PATH,
  scorerPath = process.env.DEEPSPEECH_SCORER_PATH,
  vadOptions = {},
  bufferInterval = 1000,
  sampleRate = 16000,
  codec = 'pcm', // supported: ['pcm']
  // _bufferBetweenSilences = bufferBetweenSilences,
  // _wavTo16BitPcm = wavTo16BitPcm
  _createModel = createModel,
  _transcribe = transcribe,
}) {
  if (!modelPath) return () => throwError(new Error('modelPath is required'));
  if (!scorerPath) return () => throwError(new Error('scorerPath is required'));
  const model = _createModel({modelPath, scorerPath});
  // file chunks should be encoded as 16-bit-integer PCM data
  return fileChunk$ => fileChunk$.pipe(
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
    _transcribe({model, sampleRate})
  );
};

export const testExports = {createModel, transcribe};
export default toDeepSpeech;
