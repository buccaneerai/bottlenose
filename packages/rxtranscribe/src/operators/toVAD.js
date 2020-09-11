import VAD from 'node-vad';
import {from,of,throwError,zip} from 'rxjs';
import {map, mergeMap, tap} from 'rxjs/operators';

const VOICE = 'VOICE';
const SILENCE = 'SILENCE';
const ERROR = 'ERROR';
const NOISE = 'NOISE';
const UNKNOWN = 'UNKNOWN';

const VAD_ENUMS = {VOICE, ERROR, SILENCE, NOISE, UNKNOWN};

function mapVadToEventType(vadValue) {
  switch (vadValue) {
    case VAD.Event.VOICE:
      return {type: VOICE};
    case VAD.Event.SILENCE:
      return {type: SILENCE};
    case VAD.Event.NOISE:
      return {type: NOISE};
    case VAD.Event.ERROR:
      return {type: ERROR};
    default:
      return {type: UNKNOWN};
  }
}

// expects audio chunks to be between 36ms and 144ms
// https://www.npmjs.com/package/node-vad
const toVAD = function toVAD({
  vad = (new VAD(VAD.Mode.VERY_AGGRESSIVE)),
  sampleRate = 16000
}) {
  return fileChunk$ => fileChunk$.pipe(
    mergeMap(chunk => zip(
      of(chunk),
      from(vad.processAudio(chunk, sampleRate))
    )),
    // tap(r => console.log(`RAN VAD WITH: ${JSON.stringify(r)}`)),
    map(([chunk, vadValue]) => [
      chunk,
      mapVadToEventType(vadValue)
    ]),
    // mergeMap(([chunk, vadEvent]) => (
    //   vadEvent && vadEvent.type === VAD_ERROR
    //   ? throwError(new Error('VAD ERROR'))
    //   : of([chunk, vadEvent])
    // )),
    // tap(r => console.log(`RAN VAD WITH: ${JSON.stringify(r)}`)),
  );
};

export {VAD_ENUMS as VadEvents};
export default toVAD;
