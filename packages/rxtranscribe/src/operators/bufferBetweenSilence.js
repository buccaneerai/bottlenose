import {of, iif, generate, EMPTY, forkJoin, BehaviorSubject} from 'rxjs';
import {finalize, zip, takeLast, share, mergeMap, map, tap, pairwise, reduce, skipWhile, expand, takeWhile, takeUntil, take} from 'rxjs/operators';
import toVAD, {VadEvents} from './toVAD';

const MIN_CHUNK_SIZE = 10000;
const VAD_SAMPLE_SIZE = 1000;

/**
 *
 * @param vadOptions options that vad uses for the operator
 * @param _toVAD The VAD operator
 */
const bufferBetweenSilence = function bufferBetweenSilence({
  vadOptions = { sampleRate: 16000 },
  _toVAD = toVAD,
}) {
  return chunk$ => {
    let offset = 0;

    // Replays the same chunk that was supplied
    const chunkSub$ = chunk$.pipe(share());

    const pump = (subject$) => ([vadRes, chunk]) => {
      console.log('Offset', offset);
      console.log('Chunk Length', chunk.length);
      // console.log('Pump values', [vadRes, chunk]);
      offset += VAD_SAMPLE_SIZE;
      console.log('this should be false', chunk.length - offset < MIN_CHUNK_SIZE);
      console.log('this should also be false', vadRes === VadEvents.SILENCE);
      if (chunk.length - offset < MIN_CHUNK_SIZE || vadRes === VadEvents.SILENCE) {
        console.log('We should not be getting here.');
        return subject$.complete();
      }
      console.log('We should definitely get here.');
      return subject$.next(offset);
    };

    const byteOffset$ = new BehaviorSubject(0);
    const pumpNext = pump(byteOffset$);

    // Creates slices for VAD to run against
    const slicer$ = byteOffset$.pipe(
      // tap(r => console.log('Inside the byteOffset', offset)),
      zip(chunkSub$),
      // tap(r => console.log('Ran zip on chunk sub', r)),
      map(([newOffset, chunk]) => (
        chunk.subarray(
          chunk.length - newOffset - VAD_SAMPLE_SIZE - 1, chunk.length - newOffset - 1
        )
      )),
      // tap(r => console.log('Got the new offset', r)),
      _toVAD({...vadOptions}),
      // tap(r => console.log('Vad Result', r)),
      map(([,{type}]) => type),
      zip(chunkSub$),
      tap(pumpNext),
      // reduce((acc, val) => val)
    );

    // const recusivePartioner$ = slicer$.pipe(
    //   expand(([vadRes, chunk]) => {
    //     console.log(`Chunk: ${chunk.length}, Offset: ${offset}, VAD: ${vadRes}`)
    //     if (vadRes === VadEvents.SILENCE || chunk.length - offset < MIN_CHUNK_SIZE) return EMPTY;
    //     return chunkAndVad$;
    //   }),
    // );

    // Set the offset and chunks
    return slicer$.pipe(
      // skipWhile(chunk => !isSilentOrTooSmall(chunk)),
      takeLast(), // Behavior Subject to fix the double emitting should work
      tap(() => console.log(`Ending offset: ${offset}`)),
      map(([, chunk]) => {
        console.log('Result Merge', chunk);
        return [
          chunk.subarray(0, offset),
          chunk.subarray(offset, chunk.length - 1)
        ];
      }),
      tap(r => console.log(`Chunks: ${r.length}`)),
      tap(r => console.log(`Chunk1: ${r[0].length}`)),
      tap(r => console.log(`Chunk2: ${r[1].length}`)),
      pairwise(),
      // There has to be a cleaner way to make this work...
      // returns
      // [
      //  [previousBeforeSilence, previousAfterSilence],
      //  [currentBeforeSilence, currentAfterSilence]
      // ]
      // These are wrong for some reason
      // tap(r => console.log(`Pairwise Length: ${JSON.stringify(r.length)}`)),
      // tap(r => console.log(`Pairwise 0: ${JSON.stringify(r[0].length)}`)),
      tap(r => console.log(`Pairwise0[0][0]: ${JSON.stringify(r[0][0].length)}`)),
      tap(r => console.log(`Pairwise0[0][1]: ${JSON.stringify(r[0][1].length)}`)),
      // tap(r => console.log(`Pairwise Values: ${JSON.stringify(r.length)}`)),
      // tap(r => console.log(`Pairwise 1: ${JSON.stringify(r[1].length)}`)),
      tap(r => console.log(`Pairwise1[1][0]: ${JSON.stringify(r[1][0].length)}`)),
      tap(r => console.log(`Pairwise1[1][1]: ${JSON.stringify(r[1][1].length)}`)),
      map(([previousChunk, currentChunk]) => {
        // Start of stream
        if (previousChunk.length <= 0) return currentChunk[0];
        // End of stream
        if (currentChunk.length <= 0) return previousChunk[1];
        // Middle of stream
        return Buffer.concat([previousChunk[1], currentChunk[0]]);
      }),
      // tap(r => console.log(`Map Value: ${JSON.stringify(r.length)}`)),
    );
  };
};

export default bufferBetweenSilence;
