const prompt = require('prompt');
const optimist = require('optimist');
const path = require('path');
const {throwError} = require('rxjs');
const {tap} = require('rxjs/operators');
const {fromFile} = require('@bottlenose/rxfs');

// const {transcribe} = require('../src/index');
const {toAWS} = require('../build/index');
const {toDeepSpeech} = require('../build/index');
// import {toGCP} from '../src/index';
// import {toDeepgram} from '../src/index';

console.log('running demo');

function createOperator({
  strategy,
  region = 'us-east-1',
  modelDir,
  codec = 'wav',
}) {
  switch (strategy) {
    case 'deepspeech':
      return toDeepSpeech({modelDir, codec: 'pcm'});
    case 'aws':
      return toAWS({region});
    case 'awsmed':
      return toAWS({
        region,
        isMedical: true,
        specialty: 'PRIMARYCARE',
        type: 'CONVERSATION'
      });
    // case 'gcp':
    //   return toGCP();
    // case 'deepgram':
    //   return toDeepgram();
    default:
      return () => throwError(new Error('Unsupported transcription strategy'));
  }
}

function runDemo({
  strategy,
  modelDir,
  inputFilePath = path.resolve(__dirname, './sample-audio.mp3'),
  region = 'us-east-1',
}) {
  const mp3Chunk$ = fromFile({filePath: inputFilePath});
  const transcription$ = mp3Chunk$.pipe(
    // tap(input => console.log('IN', typeof input)),
    createOperator({strategy, region, modelDir})
  );
  return transcription$;
}

const schema = {
  properties: {
    inputFilePath: {
      description: 'Path to an audio file (linear16 with sample rate of 16000 Hz)',
      type: 'string',
      default: path.resolve(__dirname, './sample-audio.pcm16bit'),
    },
    strategy: {
      description: 'Where to send the audio (deepspeech, deepgram, gcp, aws, aws-medical)',
      type: 'string',
      default: 'deepspeech',
      validator: /deepspeech*|aws*|gcp*|deepgram*|awsmed?/,
    },
    modelDir: {
      description: 'Path to a DeepSpeech-compatible tensorflow model',
      default: `${process.env.HOME}/Documents/models/deepspeech-0.6.1-models`,
      ask: () => prompt.history('strategy').value === 'deepspeech',
    },
  }
};

prompt.override = optimist.argv;
prompt.start();
prompt.get(schema, (err, params) => {
  const isAWS = ['aws', 'awsmed'].includes(params.strategy);
  if (isAWS && !process.env.AWS_ACCESS_KEY_ID) throw new Error('AWS_ACCESS_KEY_ID must be set');
  if (isAWS && !process.env.AWS_SECRET_ACCESS_KEY) throw new Error('AWS_SECRET_ACCESS_KEY must be set');
  console.log('Running pipeline...');
  const transcription$ = runDemo(params);
  transcription$.subscribe(
    out => console.log(out),
    console.error,
    () => {
      console.log('DONE');
      process.exit();
    }
  );
});
