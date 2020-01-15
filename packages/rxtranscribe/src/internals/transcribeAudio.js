// copied from https://github.com/aws-samples/amazon-transcribe-websocket-static
// https://aws.amazon.com/blogs/aws/amazon-transcribe-streaming-now-supports-websockets/
import { map, mergeMap } from 'rxjs/operators';
import { ws, send } from '@buccaneer/rxws';

import createAwsSignedUrl from './createAwsSignedUrl';
import convertAudioToBinaryMessage from './convertAudioToBinaryMessage';

// const transcribe = new AWS.TranscribeService();

// const transcribeAudio = function transcribeAudio({
//   s3OutputBucket,
//   transcribeVocabulary,
//   _transcribe = transcribe
// }) {
//   const transcribeOpts = {
//     LanguageCode: 'en-US',
//     Media: {},
//     MediaFormat: 'mp4',
//     OutputBucketName: s3OutputBucket,
//     Settings: {
//       ChannelIdentification: true,
//       MaxSpeakerLabels: 2,
//       ShowSpeakerLabels: true,
//       VocabularyName: transcribeVocabulary
//     }
//   };
//   const response$ = from(_transcribe.startTranscriptionJob(transcribeOpts));
//   return response$;
// };

// const handleVideoStream = function handleVideoStream({
//   s3Bucket,
//   s3Key,
//   videoStream$,
//   replaySize = 5
// }) {

// };

const transcribeAudio = function transcribeAudio({
  region,
  _getPresignedUrl = createAwsSignedUrl,
  _ws = ws,
  _send = send,
}) {
  return source$ => {
    const url$ = _getPresignedUrl({
      region,
    });
    const message$ = source$.pipe(
      map(audioBinary => convertAudioToBinaryMessage(audioBinary))
    );
    const ws$ = url$.pipe(
      mergeMap(url => _ws({url, message$})),
    );
    const jsonResponse$ = ws$.pipe(
      _send(message$)
    );
    return jsonResponse$;
  };
};

export default transcribeAudio;
