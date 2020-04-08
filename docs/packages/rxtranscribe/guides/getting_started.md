# Getting Started

This module makes it easy to create real-time speech-to-text (s2t) transcription from audio data.
### Installation
```bash
npm i --save @bottlenose/rxtranscribe
```

```bash
yarn add @bottlenose/rxtranscribe
```

### Configure an AWS account
To use this package, you'll need a properly configured AWS account.  The account needs to be [configured to allow real-time streaming](https://docs.aws.amazon.com/transcribe/latest/dg/websocket.html) via [AWS Transcribe](https://aws.amazon.com/transcribe/).

By default the `transcribe` operator in `@bottlenose/rxtranscribe` looks for AWS credentials and configuration stored in environment variables: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `AWS_REGION`.  You can also pass them in as optional parameters. (See the `transcribe` operator docs for up-to-date information.)

### Using the operator
Once you have AWS credentials setup, you can transcribe audio streams in real-time:
```javascript
import {fromFile} from '@bottlenose/rxfs';
import {transcribe} from '@bottlenose/rxtranscribe';

const transcribeAudioFromFile = function transcribeAudioFromFile({
  inputFilePath = path.resolve('sample-audio.mp3'),
}) {
  const transcriptionOptions = {};
  const mp3Chunk$ = fromFile({filePath: inputFilePath});
  const transcription$ = mp3Chunk$.pipe(
    transcribe(transcriptionOptions)
  );
  return transcription$;
};

export default transcribeAudio;
```

The example above uses data streamed from a local file but the `transcribe` operator can be performed on any input observable that contains [input data acceptable to AWS Transcribe's real-time streaming API](https://docs.aws.amazon.com/transcribe/latest/dg/websocket.html) (generally .wav files like .mp3).

