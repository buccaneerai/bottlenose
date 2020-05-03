[![CircleCI](https://circleci.com/gh/buccaneerai/bottlenose/tree/master.svg?style=shield)](https://circleci.com/gh/buccaneerai/bottlenose/tree/master)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
<a href="https://www.npmjs.com/package/@bottlenose/rxtranscribe">
  <img src="https://img.shields.io/npm/v/@bottlenose/rxtranscribe.svg" alt="Version">
</a>

## Description
This package allows real-time speech-to-text (STT) functionality to be performed on audio streams.  It offers numerous strategies for how the STT can be performed including the following pipelines: the opensource [DeepSpeech]() architecture, the [Amazon Transcribe API](https://aws.amazon.com/transcribe/) and [Google Speech-to-text API](https://cloud.google.com/speech-to-text/).

Currently, audio can be passed in as a stream of Buffer objects containing audio data encoded using one of the following 

## Installation
```bash
yarn add @bottlenose/rxtranscribe
```

```bash
npm i --save @bottlenose/rxtranscribe
```

### DeepSpeech
To run the DeepSpeech pipeline, [download the DeepSpeech model](https://github.com/mozilla/DeepSpeech/releases), unzip it and pass the model directory to the `toDeepSpeech` operator like this: `toDeepSpeech({modelDir: 'path/to/deepseech-models-0.7.0'})`.

### AWS Transcribe
To run the AWS Transcribe pipeline, you'll need a valid ACCESS_KEY_ID and SECRET_ACCESS_KEY with permissions to run AWS Transcribe.

### GCP Speech-to-text
- To run the GCP speech-to-text pipeline, you'll need a valid JSON file containing GCP credentials. 
- The project will need to have the speech-to-text API enabled.
- You may need to set [GOOGLE_APPLICATION_CREDENTIALS environment variable](https://cloud.google.com/docs/authentication) so that it contains the path of your credentials file.

:bulb: In the future, it would be nicer to have an npm library that can install Sox so that `yarn install` would handle all the dependencies.

## Compatibility

|Platform|Support|
|--------------|:-----------:|
|node.js (>12)|✅|
|Browsers|❓|
|React Native|❓|
|Electron|❓|

💡 This package has only been tested in the node.js environment.  If it doesn't work isomorphically, it could probably be modified to do so without much effort.  The authors haven't done so because running it on client devices does not seem like an advisable design for production situations.  But if you want to take a stab at implementing isomorphic support, [contact us](mailto:opensource@buccaneer.ai)!

## Basic Usage
```javascript
import {map} from 'rxjs/operators';
import {toDeepSpeech} from '@bottlenose/rxtranscribe';

// The pipeline takes a stream of .wav audio chunks (Buffer, String, Blob or Typed Array)
const buffer$ = pcmChunkEncodedAs16BitIntegers$.pipe(
  map(chunk => Buffer.from(chunk, 'base64')),
  toDeepSpeech({modelDir: '/path/to/deepspeech-models-0.7.0'})
);
```

## Documentation & Guides
- [Documentation](https://buccaneerai.gitbook.io/bottlenose/data-analysis/rxtranscribe)
- [Full list of operators](https://buccaneerai.gitbook.io/bottlenose/data-analysis/rxtranscribe/operators)
- [Guides](https://buccaneerai.gitbook.io/bottlenose/data-analysis/rxtranscribe/guides)
- [Introduction to audio data](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_concepts)