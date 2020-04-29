// copied from https://github.com/aws-samples/amazon-transcribe-websocket-static
// https://aws.amazon.com/blogs/aws/amazon-transcribe-streaming-now-supports-websockets/
// https://cloud.google.com/speech-to-text/docs/encoding
// https://docs.aws.amazon.com/transcribe/latest/dg/streaming.html
// https://docs.aws.amazon.com/transcribe/latest/dg/limits-guidelines.html
import { of, throwError } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { conduit } from '@bottlenose/rxws';

import createAwsSignedUrl from '../internals/createAwsSignedUrl';
import convertAudioToBinaryMessage from '../internals/convertAudioToAWSBinaryMessage';
import decodeMessage from '../internals/decodeAWSMessage';

const toAWS = function toAWS({
  region = (process.env.AWS_REGION || 'us-east-1'),
  accessKeyId = process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY,
  stop$ = of(),
  _conduit = conduit,
  _serializer = audioBinary => convertAudioToBinaryMessage({audioBinary}),
  _deserializer = message => decodeMessage({message}),
  _getPresignedUrl = createAwsSignedUrl
}) {
  return fileChunk$ => {
    const url = _getPresignedUrl({region, accessKeyId, secretAccessKey});
    const message$ = fileChunk$.pipe(
      mergeMap(fileChunk => (
        !accessKeyId || !secretAccessKey
        ? throwError(new Error('AWS credentials must be set'))
        : of(fileChunk)
      )),
      // audioBinary should be streamed as an arraybuffer type on the websocket...
      _conduit({
        url,
        serializer: _serializer,
        deserializer: _deserializer,
      }), // outputs JSON response objects
      takeUntil(stop$)
    );
    return message$;
  };
};

export default toAWS;
