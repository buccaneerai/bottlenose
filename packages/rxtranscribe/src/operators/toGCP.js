import { of, from, throwError, combineLatest, forkJoin, zip} from 'rxjs';
import { mergeMap, concatMap, takeUntil, map, tap, merge, switchMap, bufferCount, bufferTime, mergeAll, concatAll} from 'rxjs/operators';
import gcpSpeech from '@google-cloud/speech';
// import bufferBetweenSilences from '../operators/bufferBetweenSilences';

const toGCP = function toGCP({
  googleCreds = process.env.GOOGLE_APPLICATION_CREDENTIALS,
  stop$ = of(),
  sampleRate
}) {
  return fileChunk$ => {
    // Creates a client
    const clientv1 = new gcpSpeech.SpeechClient();
    // const clientv1p1beta1 = new gcpSpeech.v1p1beta1.SpeechClient();
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
      bufferCount(3),
      // bufferBetweenSilences({timeInterval: 1000, vadOptions: { sampleRate }}),
      mergeAll(),
      // THIS SHOULD WORK!!! WHY AM I GETTING EMPTY RESULTS.......... - Cory
      // There is no reason why this should be the output should be:
      //    [[{"results":[]},null,null],[{"results":[]},null,null]]
      // This should be returning the chunk that has the higher confidence rating.
      // mergeMap(fileChunk => {
      //   const audioParams = {config, audio: { content: fileChunk.toString('base64') }};
      //   return forkJoin([
      //     clientv1.recognize(audioParams),
      //     clientv1p1beta1.recognize(audioParams)
      //   ]).pipe(
      //     // tap(r => console.log(JSON.stringify(r))),
      //     map(
      //       ([one, two]) => (
      //         one.result.alternatives[0].confidence > two.result.alternatives[0].confidence
      //         ? one
      //         : two
      //       )
      //     )
      //   );
      // }),
      map(fileChunk => clientv1.recognize({config, audio: { content: fileChunk.toString('base64') }})),
      concatMap(r => r),
      // tap(r => console.log(JSON.stringify(r))),
      // tap(([res]) => (
      //   console.log(res.results.map(result => result.alternatives[0].confidence).join('\n')))
      // ),
      // map(([res]) => res.results.map(result => result.alternatives[0].transcript).join(' ')),
      map(([res]) => res.results.map(result => result.alternatives[0].transcript).join('\n')),
      // tap(r => console.log(JSON.stringify(r))),
      takeUntil(stop$)
    );
  };
};

export default toGCP;
