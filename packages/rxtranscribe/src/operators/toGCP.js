import { of, throwError, } from 'rxjs';
import { mergeMap, concatMap, takeUntil, map } from 'rxjs/operators';
import { conduit } from '@bottlenose/rxws';
import speech from '@google-cloud/speech';

// import { from } from 'rxjs';
// import { tap } from 'rxjs/operators';

// const {speech} = v1p1beta1;

const toGCP = function toGCP({
  googleCreds = process.env.GOOGLE_APPLICATION_CREDENTIALS,
  stop$ = of(),
  sampleRate
}) {
  return fileChunk$ => {
    // Creates a client
    const client = new speech.SpeechClient();
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: sampleRate,
      languageCode: 'en-US',
      // audioChannelCount: 2,
      // enableSeparateRecognitionPerChannel: true,
    };
    return fileChunk$.pipe(
      mergeMap(fileChunk => (
        !googleCreds
        ? throwError(new Error('Google Application Credentials must be set'))
        : of(fileChunk)
      )),
      map(fileChunk => client.recognize({config, audio: { content: fileChunk.toString('base64') }})),
      concatMap(r => r),
      // tap(r => console.log(JSON.stringify(r))),
      map(([res]) => res.results.map(result => result.alternatives[0].transcript).join('\n')),
      // tap(r => console.log(JSON.stringify(r))),
      takeUntil(stop$)
    );
  };
};

export default toGCP;
