// copied from https://github.com/aws-samples/amazon-transcribe-websocket-static
// https://aws.amazon.com/blogs/aws/amazon-transcribe-streaming-now-supports-websockets/
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { conduit } from '@bottlenose/rxws';

import createAwsSignedUrl from '../internals/createAwsSignedUrl';
import convertAudioToBinaryMessage from '../internals/convertAudioToBinaryMessage';

const transcribe = function transcribe({
  region = 'us-east-1',
  stop$ = of(),
  _convertAudioToBinaryMessage = convertAudioToBinaryMessage,
  _getPresignedUrl = createAwsSignedUrl,
  _conduit = conduit
}) {
  const url = _getPresignedUrl({region});
  return source$ => source$.pipe(
    map(audioBinary => _convertAudioToBinaryMessage(audioBinary)),
    _conduit({url, stop$}) // outputs JSON response objects
  );
};

export default transcribe;
