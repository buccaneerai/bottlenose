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

    // const pump = (subject$, byteLength) => ([byteOffset, s3Response]) => {
    //   const newOffset = byteOffset + byteLength;
    //   if (newOffset - 1 >= fileByteLength) return subject$.complete();
    //   return subject$.next(newOffset);
    // };

    const isSilentOrTooSmall = chunk => !noisy || chunk.length - offset < MIN_CHUNK_SIZE;
    // const chunkSliceGenerator = generate([offset, ([chunk, noise]) => isSilentOrTooSmall({chunk, noise}), );

    // Ensuring we only run this once
    const chunkSub$ = chunk$.pipe(share());
    const chunkSlicer$ = chunkSub$.pipe(
      tap(chunk => console.log(`Chunk length: ${chunk.length}`)),
      map(chunk => {
        const chunkSlice = chunk.subarray(chunk.length - offset - 3000 - 1, chunk.length - offset - 1);
        offset += 3000;
        return [chunkSlice, chunk];
      }),
      map(([slice,]) => slice),
      _toVAD({...vadOptions}),
      // tap(r => console.log(`VAD Res: ${JSON.stringify(r)}`)),
      tap(([,vadRes]) => {
        if (vadRes.type === VadEvents.SILENCE) noisy = false;
        console.log(`Offset: ${offset}, VAD: ${vadRes.type}`)
      }),
      mergeMap(() => chunkSub$.pipe()),
      // map((chunk) => ([isSilentOrTooSmall({chunk}), chunk])),
      takeWhile((chunk) => !isSilentOrTooSmall({chunk})),
      reduce((acc, val) => val)
      // tap(r => console.log(`Is it noisy? ${noisy}`))
    );

    // reduce((acc, val) => acc + val)
    // const callVad$ = chunkSlicer$.pipe(
    //   tap(r => console.log(`START: ${r.length}`)),
    //   expand(chunk => _toVAD({...vadOptions})(of(chunk))),
    //   tap(r => console.log(`Before Take and Skip: ${JSON.stringify(r)}`)),
    //   // takeWhile(([chunk, vadRes]) => !isSilentOrTooSmall({chunk, noise: vadRes.type})),
    //   skipWhile(([chunk, vadRes]) => !isSilentOrTooSmall({chunk, noise: vadRes.type})),
    //   tap(r => console.log(`After Take and Skip`)),
    // );

    // This will run vad with the subarray of the buffer
    // const runVad$ = chunkSub$.pipe(
    //   map(chunk => chunk.subarray(chunk.length - offset - 3000 - 1, chunk.length - offset - 1)),
    //   _toVAD({...vadOptions}),
    //   tap(() => { offset += 3000; }),
    //   map(([chunk, vadRes]) => ({chunk, noise: vadRes.type})),
    // );

    // const vadGenerator$ = generate(
    //   {chunk: Buffer.from(''), noise: 'NOISY'},
    //   r => isSilentOrTooSmall(r),
    //   runVad$.subscribe(
    //     next => next,
    //     console.trace,
    //     () => console.log('Generated')
    //   )
    // );

    // https://www.colincrawley.com/audio-file-size-calculator/
    // approx every 3000 Bytes is going to be what we want to pass to vad
    // Continue sampling until silence is found
    // const findSilence$ = runVad$.pipe(
    //   skipWhile(([,vad]) => vad.type !== 'SILENCE'),
    //   // map(chunk => {
    //   //   if (chunk.length > 10000) noisy = false;

    //   //   // Arbitrary value is 3x the partition we will take.
    //   //   iif(
    //   //     () => noisy && chunk.length > 10000,
    //   //     runVad$,
    //   //     of(chunk)
    //   //   );
    //   // })
    // );

    // pump or generator to loop through
    // When you reach the end you can call complete
    // Clincal api to download s3 files that uses the pump
    // TODO: There still needs to be a combine latest or something of the sort
    // Currently it would just take the output, but we want to delay the output
    // Until we have the result
    // TODO: Review the offset calculation, it may be incorrect
    // TODO: Write Tests

    // Set the offset and chunks
    return chunkSlicer$.pipe(
      // skipWhile(chunk => !isSilentOrTooSmall(chunk)),
      // take(1), // Behavior Subject to fix the double emitting should work
      tap(r => console.log(`Ending offset: ${offset}`)),
      map(chunk => ([
        chunk.subarray(0, offset),
        chunk.subarray(chunk.length - offset, chunk.length - 1)
      ])),
      tap(r => console.log(`Chunks: ${r.length}`)),
      tap(r => console.log(`Chunk1: ${r[0].length}`)),
      tap(r => console.log(`Chunk2: ${r[1].length}`)),
      pairwise(),
      tap(r => console.log(`Chunks: ${r.length}`)),
      tap(r => console.log(`Chunk1: ${r[0].length}`)),
      tap(r => console.log(`Chunk2: ${r[1].length}`)),
      // There has to be a cleaner way to make this work...
      // returns
      // [
      //  [previousBeforeSilence, previousAfterSilence],
      //  [currentBeforeSilence, currentAfterSilence]
      // ]
      // tap(r => console.log(`Pairwise Values: ${JSON.stringify(r)}`)),
      map(([previousChunk, currentChunk]) => {
        // Start of stream
        if (previousChunk.length <= 0) return currentChunk[0];
        // End of stream
        if (currentChunk.length <= 0) return previousChunk[1];
        // Middle of stream
        return Buffer.concat(previousChunk[1], currentChunk[0]);
      })
    );
  };
};

export default bufferBetweenSilence;
