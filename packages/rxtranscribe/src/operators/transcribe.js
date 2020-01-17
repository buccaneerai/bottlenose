// copied from https://github.com/aws-samples/amazon-transcribe-websocket-static
// https://aws.amazon.com/blogs/aws/amazon-transcribe-streaming-now-supports-websockets/
// https://cloud.google.com/speech-to-text/docs/encoding
// https://docs.aws.amazon.com/transcribe/latest/dg/streaming.html
// https://docs.aws.amazon.com/transcribe/latest/dg/limits-guidelines.html
import { of, throwError } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { conduit } from '@bottlenose/rxws';

import createAwsSignedUrl from '../internals/createAwsSignedUrl';
import convertAudioToBinaryMessage from '../internals/convertAudioToBinaryMessage';

const transcribe = function transcribe({
  region = (process.env.AWS_REGION || 'us-east-1'),
  accessKeyId = process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY,
  stop$ = of(),
  _conduit = conduit,
  _convertAudioToBinaryMessage = convertAudioToBinaryMessage,
  _getPresignedUrl = createAwsSignedUrl
}) {
  if (!accessKeyId || !secretAccessKey) {
    return throwError(new Error('AWS credentials must be set'));
  }
  const url = _getPresignedUrl({region, accessKeyId, secretAccessKey});
  return source$ => source$.pipe(
    map(audioBinary => _convertAudioToBinaryMessage(audioBinary)),
    _conduit({url}), // outputs JSON response objects
    takeUntil(stop$)
  );
};

export default transcribe;
