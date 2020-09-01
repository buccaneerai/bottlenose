import { of, throwError} from 'rxjs';
import {concatMap, takeUntil, map, catchError, tap, bufferCount, bufferTime, concatAll, count} from 'rxjs/operators';
import gcpSpeech from '@google-cloud/speech';
// import bufferBetweenSilences from '../operators/bufferBetweenSilences';

/**
 *
 * @param googleCreds credentials to access google cloud
 * @param client If you want to use a different client (used for mocking for tests)
 * @param stop$ Observable to stop the subscription
 * @param sampleRate sample rate of of the audio file
 * @param bufferThreshold the amount of emitted event that will be buffered into a single
 * streamed request.
 */
const toGCP = function toGCP({
  googleCreds = process.env.GOOGLE_APPLICATION_CREDENTIALS,
  client = undefined,
  stop$ = of(),
  sampleRate = 16000,
  bufferThreshold = 3,
  model = 'video'
}) {
  return fileChunk$ => {
    if (!googleCreds) return throwError(new Error('Google Application Credentials must be set'));
    const clientv1p1beta1 = client === undefined ? new gcpSpeech.v1p1beta1.SpeechClient() : client;
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: sampleRate,
      languageCode: 'en-US',
      enableWordConfidence: true,
      enableWordTimeOffsets: true,
      enableSpeakerDiarization: true,
      enableAutomaticPunctuation: true,
      model
      // audioChannelCount: 2,
      // enableSeparateRecognitionPerChannel: true,
    };
    return fileChunk$.pipe(
      bufferCount(bufferThreshold),
      map(fileChunk => clientv1p1beta1.recognize({config, audio: { content: Buffer.concat(fileChunk).toString('base64') }})),
      concatMap(r => r),
      map(([transcribedResult]) => transcribedResult.results.map(result => {
        const {alternatives: [transcription], channelTag, languageCode} = result;
        return {transcription, channelTag, languageCode};
      })),
      catchError(err => of([])),
      takeUntil(stop$)
    );
  };
};

export default toGCP;
