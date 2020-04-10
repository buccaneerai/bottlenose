import VAD from 'node-vad';
import {from,of,throwError,zip} from 'rxjs';
import {map,mergeMap} from 'rxjs/operators';

const VAD_VOICE = 'VOICE';
const VAD_SILENCE = 'SILENCE';
const VAD_ERROR = 'ERROR';
const VAD_NOISE = 'NOISE';
const VAD_UNKNOWN = 'UNKNOWN';

function mapVadToEventType(vadValue) {
  switch (vadValue) {
    case VAD.Event.VOICE:
      return {type: VAD_VOICE};
    case VAD.Event.SILENCE:
      return {type: VAD_SILENCE};
    case VAD.Event.NOISE:
      return {type: VAD_NOISE};
    case VAD.Event.ERROR:
      return {type: VAD_ERROR};
    default:
      return {type: VAD_UNKNOWN};
  }
}

const toVAD = function toVAD({
  vad = (new VAD(VAD.Mode.VERY_AGGRESSIVE)),
  sampleRate = 16000
}) {
  return fileChunk$ => fileChunk$.pipe(
    mergeMap(chunk => zip(
      of(chunk),
      from(vad.processAudio(chunk, sampleRate))
    )),
    map(([chunk, vadValue]) => [
      chunk,
      mapVadToEventType(vadValue)
    ]),
    mergeMap(([chunk, vadEvent]) => (
      vadEvent && vadEvent.type === VAD_ERROR
      ? throwError(new Error('VAD ERROR'))
      : of([chunk, vadEvent])
    ))
  );
};

export default toVAD;
