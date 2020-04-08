// See: https://github.com/mozilla/DeepSpeech-examples/blob/r0.6/ffmpeg_vad_streaming/README.MD
// https://github.com/mozilla/DeepSpeech-examples/blob/r0.6/web_microphone_websocket/server.js
// https://deepspeech.readthedocs.io/en/v0.6.1/NodeJS-API.html
import DeepSpeech from 'deepspeech';
// import MemoryStream from 'memory-stream';
// import sox from 'sox-stream';
import {from,of,throwError,zip} from 'rxjs';
import {map,filter,mergeMap,scan} from 'rxjs/operators';
// import {Duplex} from 'stream';
import VAD from 'node-vad';

let storedModel = null;

function createModel({
  modelDir,
  useSingletonModel = true,
  beamWidth = 1024,
  lmAlpha = 0.75,
  lmBeta = 1.85,
}) {
  if (useSingletonModel && storedModel) return storedModel;
  let modelPath = `${modelDir}/output_graph.pbmm`;
  let lmPath = `${modelDir}/lm.binary`;
  let triePath = `${modelDir}/trie`;
  let newModel = new DeepSpeech.Model(modelPath, beamWidth);
  newModel.enableDecoderWithLM(lmPath, triePath, lmAlpha, lmBeta);
  if (useSingletonModel) storedModel = newModel;
  return (useSingletonModel ? storedModel : newModel);
}

function ingestAudioToModel(model) {
  return chunk$ => chunk$.pipe(
    scan((acc, chunk) => [
      acc[0] + (chunk.length / 2) * (1 / 16000) * 1000, // track audio size
      chunk
    ], [0, null]),
    map(([audioLength, chunk]) => model.feedAudioContent(
      modelStream,
      chunk.slice(0, chunk.length / 2)
    ))
  );
}

const vadToText = function vadToText({
  model,
  vad = (new VAD(VAD.Mode.VERY_AGGRESSIVE)),
}) {
  return vadIn$ => vadIn$.pipe(
    mergeMap(chunk => zip(
      of(chunk),
      from(vad.processAudio(chunk, 16000))
    )),
    mergeMap(([chunk, vadEvent]) => (
      VAD.Event.ERROR
      ? throwError(new Error('VAD ERROR:'))
      : of([chunk, vadEvent])
    )),
    // filter out noise
    filter(([, vadEvent]) => vadEvent !== VAD.Event.NOISE),
    mergeMap(([chunk, vadEvent]) => {
      // during silence, get intermediate output
      ingestAudioToModel(chunk, model);
      if (vadEvent === VAD.Event.SILENCE) {
        const output = model.finishStream();
        model.startStream();
        return of(output);
      }
      return of(null);
    }),
    map(output => output),
    filter(text => text)
  );
};

const toDeepSpeech = function toDeepSpeech({
  modelDir = process.env.DEEPSPEECH_MODEL_PATH,
  useSingletonModel = true,
  _createModel = createModel,
  // inputType = 'vad'
  // interval = 2000
}) {
  const model = _createModel({modelDir, useSingletonModel});
  return vadStream$ => vadStream$.pipe(vadToText({model}));
  // return (
  //   inputType === 'vad'
  //   ? vadStream$ => vadStream$.pipe(vadToDeepSpeech)
  //   : mpegStream$ => mpegStream$.pipe()
  // );
};

// https://github.com/mozilla/DeepSpeech-examples/blob/r0.6/nodejs_wav/index.js
// const toDeepSpeech = function toDeepSpeech({
//   modelPath = './models/output_graph.pbmm',
//   lmPath = './models/lm.binary',
//   triePath = './models/trie',
//   beamWidth = 1024,
//   lmAlpha = 0.75,
//   lmBeta = 1.85,
// }) {
//   const model = new DeepSpeech.Model(modelPath, beamWidth);
//   const desiredSampleRate = model.sampleRate();
//   model.enableDecoderWithLM(lmPath, triePath, lmAlpha, lmBeta);
//   // audio chunks should be in ffmpeg format
//   return audioChunk$ => {
//     const stream = new Duplex();
//     const speechOut = new MemoryStream();
//     const pump$ = audioChunk$.pipe(
//       map(audioChunk => Buffer.from(audioChunk, 'base64')),
//       map(buffer => stream.push(buffer)),
//     );
//     stream.pipe(sox({
//       global: {
//         'no-dither': true,
//       },
//       output: {
//         bits: 16,
//         rate: desiredSampleRate,
//         channels: 1,
//         encoding: 'signed-integer',
//         endian: 'little',
//         compression: 0.0,
//         type: 'raw',
//       }
//     }).pipe(speechOut);
//     const speechOut$ = new Observable(obs => {
//       audioOut.on('data', audioBuffer => {
//         const speech = model.stt(audioBuffer.slice(0, audioBuffer.length / 2));
//         obs.next(speech);
//       });
//       audioOut.on('error', err => obs.error(err));
//       audioOut.on('finish', () => obs.complete());
//     });
//     return speechOut$;
//   };
// };

export default toDeepSpeech;
