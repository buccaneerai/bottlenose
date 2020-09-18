// Example usage:
// deepgram: DEEPGRAM_USERNAME=me@gmail.com DEEPGRAM_PASSWORD=seeecret yarn demo:run
// aws: AWS_ACCESS_KEY_ID=*** AWS_SECRET_ACCESS_KEY=*** yarn demo:run
// gcp: GOOGLE_APPLICATION_CREDENTIAL=path/to/credentials demo:run
// for deepspeech, the model must be installed locally! then:
// deepspeech: demo:run
const prompt = require('prompt');
const optimist = require('optimist');
const path = require('path');
const moment = require('moment');

const {concat, of, throwError} = require('rxjs');
const {map, scan, share,tap} = require('rxjs/operators');

const {fromFile,writeFile} = require('@bottlenose/rxfs');
const {toAWS, toDeepgram, toDeepSpeech, toGCP} = require('../build/index');

console.log('running demo');

const trace = label => tap(data => console.log(label, data));

const createOperator = ({strategy, region = 'us-east-1', modelDir, sampleRate}) => {
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
};

const runDemo = ({
  strategy,
  modelDir,
  inputFilePath = path.resolve(__dirname, './samples/sample-audio.mp3'),
  region = 'us-east-1',
  sampleRate
}) => {
  const audioChunk$ = fromFile({filePath: inputFilePath});
  const transcription$ = audioChunk$.pipe(
    // tap(input => console.log('IN', typeof input)),
    createOperator({strategy, region, modelDir, sampleRate})
  );
  return transcription$;
};

const dateFormat = 'YYYY-MM-DD-hh-mm-ss';
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
      default: `${process.env.HOME}/Documents/models/deepspeech-0.7.0-models/deepspeech-0.7.0-models`,
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

const outputWriter = filePath => message$ => {
  const rawJsonStr$ = message$.pipe(
    scan(([index], message) => [index + 1, message], [-1, null]),
    map(([index, message]) => ({index, ...message})),
    map(message => JSON.stringify(message)),
    share()
  );
  // add commas to all but the last json object
  const allButLastJsonStr$ = rawJsonStr$.pipe(
    // skipLast(1),
    map(json => `${json},`)
  );
  // const lastJsonStr$ = rawJsonStr$.pipe(takeLast(1));
  // const json$ = merge(allButLastJsonStr$, lastJsonStr$);
  const json$ = allButLastJsonStr$;
  const fileContentObservables = [
    of('['), // starting character
    json$, // JSON objects
    of(']'), // ending character
  ];
  const outputWriter$ = concat(...fileContentObservables).pipe(
    trace('outputToWrite'),
    map(str => Buffer.from(str)),
    trace('bufferToWrite'),
    writeFile({filePath}),
    trace('writeResult')
  );
  return outputWriter$;
};

prompt.override = optimist.argv;
prompt.start();
prompt.get(schema, (err, params) => {
  const isAWS = ['aws', 'awsmed'].includes(params.strategy);
  if (isAWS && !process.env.AWS_ACCESS_KEY_ID) {
    throw new Error('AWS_ACCESS_KEY_ID must be set');
  }
  if (isAWS && !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error('AWS_SECRET_ACCESS_KEY must be set');
  }
  if (params.strategy === 'deepgram' && !process.env.DEEPGRAM_USERNAME) {
    throw new Error('DEEPGRAM_USERNAME must be set');
  }
  if (params.strategy === 'deepgram' && !process.env.DEEPGRAM_PASSWORD) {
    throw new Error('DEEPGRAM_PASSWORD must be set');
  }
  if (params.strategy === 'gcp' && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS must be set');
  }
  console.log('Running pipeline...');

  const transcription$ = runDemo(params).pipe();
  const outputWriter$ = transcription$.pipe(
    outputWriter(params.outputPath)
  );
  transcription$.subscribe(
    out => console.log(JSON.stringify(out)),
    console.trace,
    () => {
      console.log('DONE');
      if (!params.shouldStoreOutput) process.exit();
    }
  );

  if (params.shouldStoreOutput === 'y')
    outputWriter$.subscribe(null, console.trace, () => 1);
});
