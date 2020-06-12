const fs = require('fs');
const prompt = require('prompt');
const optimist = require('optimist');
const path = require('path');
const moment = require('moment');
const {throwError} = require('rxjs');
const {map,reduce,share,tap} = require('rxjs/operators');
const {fromFile} = require('@bottlenose/rxfs');

// const {transcribe} = require('../src/index');
const {toAWS, toDeepgram, toDeepSpeech, toGCP} = require('../build/index');
// import {toDeepgram} from '../src/index';

console.log('running demo');

function createOperator({
  strategy,
  region = 'us-east-1',
  modelDir,
  sampleRate
}) {
  switch (strategy) {
    case 'deepspeech':
      return toDeepSpeech({modelDir});
    case 'aws':
      return toAWS({region});
    case 'awsmed':
      return toAWS({
        region,
        isMedical: true,
        specialty: 'PRIMARYCARE',
        type: 'CONVERSATION'
      });
    case 'gcp':
      return toGCP({sampleRate});
    case 'deepgram':
      return toDeepgram();
    default:
      return () => throwError(new Error('Unsupported transcription strategy'));
  }
}

function runDemo({
  strategy,
  modelDir,
  inputFilePath = path.resolve(__dirname, './samples/sample-audio.mp3'),
  region = 'us-east-1',
  sampleRate
}) {
  const mp3Chunk$ = fromFile({filePath: inputFilePath});
  const transcription$ = mp3Chunk$.pipe(
    // tap(input => console.log('IN', typeof input)),
    createOperator({strategy, region, modelDir, sampleRate})
  );
  return transcription$;
}

const dateFormat = 'YYYY-MM-DD-hh:mm:ss';
const schema = {
  properties: {
    inputFilePath: {
      description: 'Path to an audio file (linear16 with sample rate of 16000 Hz)',
      type: 'string',
      default: path.resolve(__dirname, './samples/sample-audio.pcm16bit'),
      // default: path.resolve(__dirname, './samples/audio.raw'),
      // default: path.resolve(__dirname, './samples/commercial_mono.wav'),
    },
    strategy: {
      description: 'Where to send the audio (deepspeech, deepgram, gcp, aws, aws-medical)',
      type: 'string',
      default: 'deepspeech',
      // default: 'gcp',
      validator: /deepspeech*|aws*|gcp*|deepgram*|awsmed?/,
    },
    modelDir: {
      description: 'Path to a DeepSpeech-compatible tensorflow model',
      default: `${process.env.HOME}/Documents/models/deepspeech-0.6.1-models`,
      ask: () => prompt.history('strategy').value === 'deepspeech',
    },
    sampleRate: {
      description: 'SampleRate for the audio',
      default: 16000,
      // default: 8000,
      ask: () => prompt.history('strategy').value === 'gcp',
    },
    shouldStoreOutput: {
      description: 'Do you want to save the output? (y/n)',
      default: 'n',
    },
    outputPath: {
      description: 'Where do you want to store the output JSON?',
      default: `${process.env.HOME}/Desktop/stt-${moment().format(dateFormat)}.json`,
      ask: () => prompt.history('shouldStoreOutput').value === 'y',
    }
  }
};

prompt.override = optimist.argv;
prompt.start();
prompt.get(schema, (err, params) => {
  const isAWS = ['aws', 'awsmed'].includes(params.strategy);
  if (isAWS && !process.env.AWS_ACCESS_KEY_ID) throw new Error('AWS_ACCESS_KEY_ID must be set');
  if (isAWS && !process.env.AWS_SECRET_ACCESS_KEY) throw new Error('AWS_SECRET_ACCESS_KEY must be set');
  if (params.strategy === 'gcp' && !process.env.GOOGLE_APPLICATION_CREDENTIALS) throw new Error('GOOGLE_APPLICATION_CREDENTIALS must be set');
  console.log('Running pipeline...');

  const transcription$ = runDemo(params).pipe(share());
  const output$ = transcription$.pipe(
    reduce((acc, message) => [...acc, message], []),
    map(messages => JSON.stringify(messages)),
    map(json => Buffer.from(json)),
    map(buffer => fs.writeFileSync('', buffer)),
  );
  transcription$.subscribe(
    out => console.log(out),
    console.error,
    () => {
      console.log('DONE');
      process.exit();
    }
  );
  if (params.shouldStoreOutput === 'y') output$.subscribe();
});
