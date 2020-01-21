[![CircleCI](https://circleci.com/gh/buccaneerai/bottlenose/tree/master.svg?style=shield)](https://circleci.com/gh/buccaneerai/bottlenose/tree/master)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
<a href="https://www.npmjs.com/package/@bottlenose/rxtranscribe">
  <img src="https://img.shields.io/npm/v/@bottlenose/rxtranscribe.svg" alt="Version">
</a>

## Description
This package allows real-time speech-to-text (S2T) functionality using a WebSocket which streams audio data to AWS Transcribe. Two reasons why the team at [Buccaneer](https://www.buccaneer.ai) decided to write a package for it:

1. At the time this was written in Fall 2019, the [Transcribe API](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/TranscribeService.html) in `aws-sdk` did not support real-time audio streaming and Amazon did not provide an official JavaScript client for real-time subscription.  For many speech-to-text use cases, real-time transcription is mandatory.  (**Tip**: If your goal is to transcribe an audio file in its entirety and you can wait for the entire file to be processed, then you can use the `aws-sdk` and you don't need this library!)

2. This implementation makes it easy to plug AWS Transcribe into [RxJS 6](https://rxjs-dev.firebaseapp.com/api) pipelines.

3. This package encapsulates the business logic of AWS Transcribe streaming into a separate `npm` package so that applications can focus on what they're good at and don't need to worry about the internals of how AWS Transcribe processes audio data streams.

## Installation
```bash
yarn add @buccaneer/rxtranscribe
```

```bash
npm i --save @buccaneer/rxtranscribe
```

## Compatibility

|Platform|Support|
|--------------|:-----------:|
|node.js (>10.8)|✅|
|Browsers|❌|
|React Native|❌|
|Electron|❌|

💡 This package could perhaps be modified to work universally by polyfilling in the `Buffer` object.  The authors haven't bothered to do it because our use case did not require it to run on clients.  But if you want to take a stab at implementing it, [contact us](mailto:opensource@buccaneer.ai)!

## Basic Usage
```javascript
import { transcribe } from '@buccaneer/rxtranscribe';

// The pipeline takes a stream of .wav audio chunks (Buffer, String, Blob or Typed Array)
const buffer$ = chunk$.pipe(
  map(chunkStr => Buffer.from(chunkString, 'base64')),
  transcribe()
);
```

💡 One limitation of the current package is that it currently only supports `.wav` files as inputs, which are [encoded as](https://cloud.google.com/speech-to-text/docs/encoding) .mp4 files.  It would be nice to support a wider variety of file types.  If you know how to do this and want to help implement this functionality, please [contact us](opensource@buccaneer.ai).

## Documentation & Guides
- [Documentation](https://buccaneerai.gitbook.io/bottlenose/data-analysis/rxtranscribe)
- [Full list of operators](https://buccaneerai.gitbook.io/bottlenose/data-analysis/rxtranscribe/operators)
- [Guides](https://buccaneerai.gitbook.io/bottlenose/data-analysis/rxtranscribe/guides)