import {of, iif, generate} from 'rxjs';
import {share, mergeMap, map, tap, pairwise, reduce, skipWhile, expand, takeWhile, takeUntil, take} from 'rxjs/operators';

import toVAD, {VadEvents} from './toVAD';

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
    const MIN_CHUNK_SIZE = 10000;
    let offset = 0;
    let noisy = true;

    const isSilentOrTooSmall = chunk => !noisy || chunk.length - offset < MIN_CHUNK_SIZE;

    // Ensuring we only run this once
    const chunkSub$ = chunk$.pipe(share());

    const chunkSlicer$ = chunkSub$.pipe(
      takeWhile((chunk) => !isSilentOrTooSmall({chunk})),
      tap(chunk => console.log(`Chunk length: ${chunk.length}`)),
      tap(chunk => console.log(`Chunk difference: ${chunk.length - offset}`)),
      map(chunk => {
        const chunkSlice = chunk.subarray(chunk.length - offset - 3000 - 1, chunk.length - offset - 1);
        offset += 3000;
        return [chunkSlice, chunk];
      }),
      map(([slice,]) => slice),
      _toVAD({...vadOptions}),
      tap(([,vadRes]) => {
        if (vadRes.type === VadEvents.SILENCE) noisy = false;
        console.log(`Offset: ${offset}, VAD: ${vadRes.type}`)
      }),
      // mergeMap(() => chunkSub$.pipe()),
      // map((chunk) => ([isSilentOrTooSmall({chunk}), chunk])),
      reduce((acc, val) => val),
    );

    // Set the offset and chunks
    return chunkSlicer$.pipe(
      // skipWhile(chunk => !isSilentOrTooSmall(chunk)),
      take(1), // Behavior Subject to fix the double emitting should work
      mergeMap(() => chunkSub$.pipe()),
      tap(r => console.log(`Ending offset: ${offset}`)),
      map(chunk => ([
        chunk.subarray(0, offset),
        chunk.subarray(chunk.length - offset, chunk.length - 1)
      ])),
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
