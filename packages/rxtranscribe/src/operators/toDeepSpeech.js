// See: https://github.com/mozilla/DeepSpeech-examples/blob/r0.6/ffmpeg_vad_streaming/README.MD
// https://github.com/mozilla/DeepSpeech-examples/blob/r0.6/web_microphone_websocket/server.js
// https://deepspeech.readthedocs.io/en/v0.6.1/NodeJS-API.html
import DeepSpeech from 'deepspeech';
// import MemoryStream from 'memory-stream';
// import sox from 'sox-stream';
import {interval,of,throwError} from 'rxjs';
import {
  bufferToggle,
  filter,
  map,
  mergeMap,
  share,
  takeLast
} from 'rxjs/operators';
// import {Duplex} from 'stream';

import toVAD from './toVAD';

function createModel({
  modelDir,
  useSingletonModel = true,
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

function ingestAudioToModel({model, sampleRate = 16000}) {
  return chunks$ => chunks$.pipe(
    map(chunks => [chunks, model.createStream()]),
    mergeMap(([chunks, modelStream]) => (
      of(...chunks.map(c => [c, modelStream]))
    )),
    // scan((acc, [chunk, modelStream]) => [
    //   acc[0] + (chunk.length / 2) * (1 / sampleRate) * 1000, // track audio size
    //   chunk
    // ], [0, null]),
    // map(([audioLength, chunk]) => {
    map(([chunk, modelStream]) => {
      model.feedAudioContent(modelStream, chunk.slice(0, chunk.length / 2));
    }),
    takeLast(1),
    map(() => model.finishStream()),
    // bug in DeepSpeech 0.6 causes silence to be inferred as "i" or "a"
    filter(text => text !== 'i' && text !== 'a')
  );
}

const windowAudioChunks = function windowAudioChunks({
  vadOptions = { sampleRate: 16000 },
  timeInterval = 5000,
  _toVAD = toVAD,
}) {
  return chunk$ => {
    const chunkSub$ = chunk$.pipe(share());
    const chunkAndVad$ = chunkSub$.pipe(
      _toVAD({...vadOptions}),
      share()
    );
    // close the buffer when both
    // (1) the time threshhold is exceeded and
    // (2) the VAD detects silence (a pause in the conversation)
    const stop$ = interval(timeInterval).pipe(
      mergeMap(() => chunkAndVad$.pipe(
        filter(([,vad]) => vad.type === 'SILENCE')
      )),
    );
    const buffer$ = chunkSub$.pipe(
      // immediately emit the buffer when the stop$ condition is triggered
      bufferToggle(stop$, () => of(true))
    );
    return buffer$;
  };
};

// TODO - this should return confidence levels and timestamps...
const toDeepSpeech = function toDeepSpeech({
  modelDir = process.env.DEEPSPEECH_MODEL_PATH,
  vadOptions = {},
  bufferInterval = 1000,
  sampleRate = 16000,
  _createModel = createModel,
  _windowAudioChunks = windowAudioChunks,
  _ingestAudioToModel = ingestAudioToModel,
}) {
  const model = _createModel({modelDir});
  return fileChunk$ => fileChunk$.pipe(
    mergeMap(chunk => (
      modelDir
      ? of(chunk)
      : throwError(
        new Error('modelDir<String> is required for toDeepSpeech operator')
      )
    )),
    _windowAudioChunks({vadOptions: {...vadOptions, sampleRate}}),
    _ingestAudioToModel({model, sampleRate})
  );
};

export const testExports = {
  createModel,
  windowAudioChunks,
  ingestAudioToModel
};
export default toDeepSpeech;
