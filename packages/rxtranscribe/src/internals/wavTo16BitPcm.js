// https://github.com/mozilla/DeepSpeech-examples/blob/r0.6/nodejs_wav/index.js
import {PassThrough} from 'stream';
import WAV from 'node-wav';
import sox from 'sox-stream';
import MemoryStream from 'memory-stream';
import {merge,Observable,of,throwError} from 'rxjs';
import {filter,map,mapTo,mergeMap,scan,takeLast,tap} from 'rxjs/operators';
import {rxToStream} from 'rxjs-stream';

function downsample({
  desiredSampleRate = 16000,
  // _Duplex = Duplex,
  _MemoryStream = MemoryStream,
  _rxToStream = rxToStream,
  _sox = sox,
}) {
  return wavChunk$ => {
    const wavBuffer$ = wavChunk$.pipe(
      map(wavChunk => Buffer.from(wavChunk))
    );
    const writeStream = new _MemoryStream();
    const audioStream = new PassThrough();
    const logStream = new PassThrough();
    const transcoder = _sox({
      global: { 'no-dither': true },
      input: { type: 'wav' },
      output: {
        bits: 16,
        rate: desiredSampleRate,
        channels: 1,
        encoding: 'signed-integer',
        endian: 'little',
        compression: 0.0,
        type: 'raw',
      }
    });
    // const pump$ = wavChunk$.pipe(
    //   tap(d => console.log('BUFFER', d)),
    //   map(wavChunk => Buffer.from(wavChunk)),
    //   tap(buffer => duplexStream.push(buffer)),
    //   takeLast(1),
    //   tap(() => duplexStream.push(null)), // end the ReadStream
    //   mapTo(null)
    // );
    // logStream.on('data', chunk => console.log('LOGSTREAM', chunk));
    const downsampledBuffer$ = new Observable(obs => {
      const readStream = _rxToStream(wavBuffer$);
      readStream
        // .pipe(logStream)
        .pipe(transcoder)
        // .pipe(audioStream)
        .pipe(process.stdout);
      transcoder.on('error', err => obs.error(err));
      audioStream.on('data', chunk => console.log('AUDIOSTREAM',chunk));
      audioStream.on('data', chunk => obs.next(chunk));
      audioStream.on('end', () => {
        console.log('AudioStream.end');
        obs.complete();
      });
      audioStream.on('error', err => obs.error(err));
    });
    // return merge(pump$, downsampledBuffer$).pipe(
    return downsampledBuffer$.pipe(
      tap(d => console.log('downsample', d)),
      // only emit items from the downsampledBuffer$ stream
      filter(data => data !== null)
    );
  };
}

const wavTo16BitPcm = function wavTo16BitPcm({
  sampleRate = 16000,
  _WAV = WAV
}) {
  return wavChunk$ => wavChunk$.pipe(
    scan((acc, chunk) => (
      acc[0]
      ? [acc[0], chunk]
      : [_WAV.decode(chunk).sampleRate, chunk]
    ), [null, null]),
    mergeMap(([wavSampleRate, chunk]) => (
      wavSampleRate < sampleRate
      ? throwError(new Error(
        'WAV sample rate must be greater than desiredSampleRate'
      ))
      : of(chunk)
    )),
    downsample({desiredSampleRate: sampleRate})
  );
};

export default wavTo16BitPcm;
