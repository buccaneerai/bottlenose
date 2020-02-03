// copied from https://github.com/aws-samples/amazon-transcribe-websocket-static
// https://aws.amazon.com/blogs/aws/amazon-transcribe-streaming-now-supports-websockets/
// https://cloud.google.com/speech-to-text/docs/encoding
// https://docs.aws.amazon.com/transcribe/latest/dg/streaming.html
// https://docs.aws.amazon.com/transcribe/latest/dg/limits-guidelines.html
import { of, throwError } from 'rxjs';
import { map, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { conduit } from '@bottlenose/rxws';

import createAwsSignedUrl from '../internals/createAwsSignedUrl';
import convertAudioToBinaryMessage from '../internals/convertAudioToBinaryMessage';
import decodeMessage from '../internals/decodeMessage';

const transcribe = function transcribe({
  region = (process.env.AWS_REGION || 'us-east-1'),
  accessKeyId = process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY,
  stop$ = of(),
  _conduit = conduit,
  _serializer = audioBinary => convertAudioToBinaryMessage({audioBinary}),
  _deserializer = message => decodeMessage({message}),
  _getPresignedUrl = createAwsSignedUrl
}) {
  const url = _getPresignedUrl({region, accessKeyId, secretAccessKey});
  return source$ => source$.pipe(
    mergeMap(fileChunk => (
      !accessKeyId || !secretAccessKey
      ? throwError(new Error('AWS credentials must be set'))
      : of(fileChunk)
    )),
    // map(audioBinary => _convertAudioToBinaryMessage(audioBinary)),
    // audioBinary should be streamed as an arraybuffer type on the websocket...
    // tap(d => console.log('IN', d)),
    _conduit({
      url,
      serializer: _serializer,
      deserializer: _deserializer,
    }), // outputs JSON response objects
    tap(out => console.log('OUTPUT', out)),
    takeUntil(stop$)
  );
};

export default transcribe;
