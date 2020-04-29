const times = require('lodash/times');
const {mergeMap} = require('rxjs/operators');
// import {fork} from 'child_process';
const {Observable} = require('rxjs');
const {Worker, isMainThread, parentPort, workerData} = require('worker_threads');

// Downsampling is a little complicated...  These links are helpful:
// Float32Array https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer
// https://databasefaq.com/index.php/answer/260970/javascript-html5-nodejs-audio-webkitaudiocontext-downsampling-a-pcm-audio-buffer-in-javascript
// https://stackoverflow.com/questions/53810058/downsample-the-audio-from-buffer-inputs-from-48000-to-16000
// https://stackoverflow.com/questions/15087668/how-to-convert-pcm-samples-in-byte-array-as-floating-point-numbers-in-the-range
// https://github.com/Picovoice/web-voice-processor/blob/master/src/downsampling_worker.js
function downsample({
  frame,
  sampleRate,
  desiredSampleRate = 16000
}) {
  if (sampleRate < desiredSampleRate) {
    throw new Error(
      'Downsampling rate show be smaller than original sample rate'
    );
  }
  const sampleRateRatio = sampleRate / desiredSampleRate;
  // convert AudioBuffer (PCM 32-bit floats) to 16-bit integers
  // const intSamples = frame.map(sample => sample * 32767);
  const newLength = Math.round(frame.length / sampleRateRatio);
  const [downsampledBuffer] = frame.reduce((acc, sample, index) => {
    const numFrames = Math.min(acc[1] - index, frame.length - index);
    const sampleIndexes = times(numFrames).map(num => num + index);
    const sum = sampleIndexes.reduce((memo, i) => memo + frame[i], [0, 0]);
    return [
      // convert to 16-bit int
      {...acc[0], [index]: Math.min(1, sum / numFrames) * 0x7FFF},
      Math.round((index + 1) * sampleRateRatio)
    ];
  }, [new Int16Array(newLength), 0]);
  return downsampledBuffer;
}

// if (isMainThread) {
//   module.exports = function parseJSAsync(script) {
//     return new Promise((resolve, reject) => {
//       const worker = new Worker(__filename, {
//         workerData: script
//       });
//       worker.on('message', resolve);
//       worker.on('error', reject);
//       worker.on('exit', (code) => {
//         if (code !== 0)
//           reject(new Error(`Worker stopped with exit code ${code}`));
//       });
//     });
//   };
// } else {
//   const { parse } = require('some-js-parsing-library');
//   const script = workerData;
//   parentPort.postMessage(parse(script));
// }
