import {interval,merge,of} from 'rxjs';
import {bufferToggle,filter,mergeMap,share,tap} from 'rxjs/operators';

import toVAD from './toVAD';

const bufferBetweenSilences = function bufferBetweenSilences({
  vadOptions = { sampleRate: 16000 },
  timeInterval = 5000,
  _toVAD = toVAD,
}) {
  return chunk$ => {
    const chunkSub$ = chunk$.pipe(
      tap(c => console.log('CHUNK', c)),
      share()
    );
    const chunkAndVad$ = chunkSub$.pipe(
      tap(c => console.log('CHUNK_AGAIN', c)),
      _toVAD({...vadOptions}),
      share()
    );
    // close the buffer when both
    // (1) the time threshhold is exceeded and
    // (2) the VAD detects silence (a pause in the conversation)
    const stop$ = merge(of(true), interval(timeInterval)).pipe(
      tap(i => console.log('INTERVAL', i)),
      mergeMap(() => chunkAndVad$.pipe(
        tap(c => console.log('CHUNK_AND_VAD', c)),
        filter(([,vad]) => vad.type === 'SILENCE')
      )),
      tap(() => console.log('STOP'))
    );
    const buffer$ = chunkSub$.pipe(
      // immediately emit the buffer when the stop$ condition is triggered
      bufferToggle(stop$, () => stop$),
      tap(b => console.log('BUFFER_OUT', b))
    );
    return buffer$;
  };
};

export default bufferBetweenSilences;
