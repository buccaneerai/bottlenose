// See: https://github.com/mozilla/DeepSpeech-examples/blob/r0.6/ffmpeg_vad_streaming/README.MD
// https://github.com/mozilla/DeepSpeech-examples/blob/r0.6/web_microphone_websocket/server.js
// https://deepspeech.readthedocs.io/en/v0.6.1/NodeJS-API.html
import {Model} from 'deepspeech';
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

const errors = {
  missingModelDir: () => (
    new Error('modelDir<String> is required for toDeepSpeech operator')
  )
};

const createModel = ({
  modelDir,
  beamWidth = 1024,
  lmAlpha = 0.75,
  lmBeta = 1.85,
  _newModel = dir => new Model(dir)
}) => {
  const modelPath = `${modelDir}.pbmm`;
  const scorerPath = `${modelDir}.scorer`;
  const newModel = _newModel(modelPath);
  newModel.setBeamWidth(beamWidth);
  newModel.enableExternalScorer(scorerPath);
  // let modelPath = `${modelDir}/output_graph.pbmm`;
  // let lmPath = `${modelDir}/lm.binary`;
  // let triePath = `${modelDir}/trie`;
  // let newModel = _newModel(modelPath, beamWidth);
  // newModel.enableDecoderWithLM(lmPath, triePath, lmAlpha, lmBeta);
  return newModel;
};

const transcribeChunks = ({model, sampleRate, candidateCount = 1}) => (
  chunks => {
    // mergeMap(chunks => new Observable(obs => {
    const fullBuffer = Buffer.concat(chunks);
    const output = model.sttWithMetadata(fullBuffer, candidateCount);
    return output;
    // const modelStream = model.createStream();
    // chunks.forEach(chunk => (
      // model.feedAudioContent(modelStream, chunk.slice(0, chunk.length / 2))
      // modelStream.feedAudioContent(chunk)
    // ));
    // const output = model.finishStream(modelStream);
    // const output = model.stt(chunks[0].slice(0, chunks[0].length / 2));
    // const output = model.finishStream(modelStream);
    // obs.next(output);
    // return obs.complete();
  }
);

const transcribe = ({model, sampleRate = 16000, candidateCount = 1}) => (
  bufferedChunks$ => (
    bufferedChunks$.pipe(
      filter(chunks => !!chunks && chunks.length), // filter out empty objects
      map(transcribeChunks({model, sampleRate, candidateCount})),
      // mergeAll(1),
      // bug in DeepSpeech 0.6 causes silence to be inferred as "i" or "a"
      // filter(text => text !== 'i' && text !== 'a')
    )
  )
);

// eslint-disable-next-line camelcase
const transcriptWordReducer = ({words, nextWord}, {text, start_time}) => (
  // handle new words
  text === ' '
  ? {
      words: [...words, {...nextWord, endTime: start_time}], // eslint-disable-line camelcase
      nextWord: {text: '', startTime: null},
    }
  : {
      words,
      nextWord: {
        text: `${nextWord.text}${text}`,
        startTime: nextWord.startTime || start_time, // eslint-disable-line camelcase
      }
    }
);

const standardizeOutput = () => deepSpeechMetadata => ({
  transcripts: deepSpeechMetadata.transcripts.map(transcript => ({
    confidence: transcript.confidence,
    words: transcript.tokens.reduce(
      transcriptWordReducer,
      {words: [], nextWord: {text: '', startTime: null}}
    ).words,
  }))
});

const toDeepSpeech = ({
  modelDir = process.env.DEEPSPEECH_MODEL_PATH,
  // vadOptions = {},
  // bufferInterval = 1000,
  sampleRate = 16000,
  bufferSize = 3,
  candidateCount = 1, // number of candidate transcripts
  // codec = 'pcm', // supported: ['pcm']
  rawOutput = false,
  // _bufferBetweenSilences = bufferBetweenSilences,
  // _wavTo16BitPcm = wavTo16BitPcm
  _createModel = createModel,
  _transcribe = transcribe,
} = {}) => {
  if (!modelDir) return () => throwError(errors.missingModelDir());
  // Warning: This is not a pure function! Model only gets instantiated once!
  const model = _createModel({modelDir});

  // file chunks should be encoded as 16-bit-integer PCM data
  return fileChunk$ => fileChunk$.pipe(
    bufferCount(bufferSize),
    _transcribe({model, sampleRate, candidateCount}),
    map(rawOutput ? metadata => metadata : standardizeOutput()),
  );
};

export const testExports = {
  createModel,
  standardizeOutput,
  transcribe,
  transcribeChunks,
};
export default toDeepSpeech;
