import prompt from 'prompt';
import optimist from 'optimist';
import path from 'path';
import {tap} from 'rxjs/operators';
import {fromFile} from '@bottlenose/rxfs';

import {transcribe} from '../src/index';

console.log('running demo');

function runDemo({
  inputFilePath = path.resolve(__dirname, './sample-audio.mp3'),
  region = 'us-east-1',
}) {
  const mp3Chunk$ = fromFile({filePath: inputFilePath});
  const transcription$ = mp3Chunk$.pipe(
    // tap(console.log),
    transcribe({region})
  );
  return transcription$;
}

const schema = {
  properties: {
    inputFilePath: {
      description: 'Path to an audio file (mp3/mp4/wav)',
      type: 'string',
      default: path.resolve(__dirname, './sample-audio.mp3'),
    },
    region: {
      description: 'The AWS region',
      type: 'string',
      default: 'us-east-1',
    },
  }
};

// prompt.override = optimist.argv;
// prompt.start();
// prompt.get(schema, (err, params) => {
//   if (!process.env.AWS_ACCESS_KEY_ID) throw new Error('AWS_ACCESS_KEY_ID must be set');
//   if (!process.env.AWS_SECRET_ACCESS_KEY) throw new Error('AWS_SECRET_ACCESS_KEY must be set');
  const transcription$ = runDemo({});
  transcription$.subscribe(console.log, console.error, () => {
    console.log('DONE');
    process.exit();
  });
// });
