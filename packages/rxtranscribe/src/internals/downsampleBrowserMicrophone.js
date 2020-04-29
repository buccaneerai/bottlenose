// // https://github.com/Picovoice/web-voice-processor/blob/master/src/downsampling_worker.js
// import {spawn} from 'child_process';
// import times from 'lodash/times';
// import {Observable} from 'rxjs';
// import {map} from 'rxjs/operators';

// function downsampleBuffer({
//   inputFrame,
//   sampleRate,
//   desiredSampleRate,
//   frameLength,
// }) {
//   return new Observable(obs => {
//     // convert input frame data into 16-bit integers:
//     // // https://stackoverflow.com/questions/18558271/why-the-range-of-int-is-32768-to-32767
//     let inputBuffer = inputFrame.map(chunk => chunk * 32767);
//     // this code is pretty nasty but it should work.  copied from here:
//     // https://github.com/Picovoice/web-voice-processor/blob/master/src/downsampling_worker.js
//     while (((inputBuffer.length * desiredSampleRate) / sampleRate) > frameLength) {
//       let outputFrame = new Int16Array(frameLength);
//       let sum = 0;
//       let num = 0;
//       let outputIndex = 0;
//       let inputIndex = 0;
//       while (outputIndex < frameLength) {
//         sum = 0;
//         num = 0;
//         while (inputIndex < Math.min(inputBuffer.length, (outputIndex + 1) * sampleRate / desiredSampleRate)) {
//             sum += inputBuffer[inputIndex];
//             num++;
//             inputIndex++;
//         }
//         outputFrame[outputIndex] = sum / num;
//         outputIndex++;
//       }
//       obs.next(outputFrame);
//       const newBuffer = inputBuffer.slice(inputIndex);
//       if (
//         ((newBuffer.length * desiredSampleRate) / sampleRate) <= frameLength
//       ) {
//         obs.complete();
//       }
//       inputBuffer = newBuffer;
//     }
//   });
// }

// const downsampleMicrophoneInput = function downsampleMicrophoneInput({
//   sampleRate = 44100,
//   desiredSampleRate = 16000,
//   frameLength = 512
// }) {
//   return inputFrame$ => inputFrame$.pipe(
//     map(inputFrame => downsampleBuffer({
//       inputFrame,
//       sampleRate,
//       desiredSampleRate,
//       frameLength,
//     }))
//   );
// };

// export default downsampleMicrophoneInput;
