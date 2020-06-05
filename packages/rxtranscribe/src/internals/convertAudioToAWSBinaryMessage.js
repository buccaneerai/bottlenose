// https://github.com/aws-samples/amazon-transcribe-websocket-static/blob/master/lib/main.js
import buffer from 'buffer';
import { toUtf8, fromUtf8 } from '@aws-sdk/util-utf8-node';
import { EventStreamMarshaller } from '@aws-sdk/eventstream-marshaller';

// function pcmEncode(input) {
//   let offset = 0;
//   const buffer = new ArrayBuffer(input.length * 2);
//   const view = new DataView(buffer);
//   for (let i = 0; i < input.length; i++, offset += 2) {
//     const s = Math.max(-1, Math.min(1, input[i]));
//     view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
//   }
//   return buffer;
// }

function getAudioEventMessage(pcmBuffer) {
  return {
    headers: {
      ':message-type': {
        type: 'string',
        value: 'event'
      },
      ':event-type': {
        type: 'string',
        value: 'AudioEvent'
      }
    },
    body: pcmBuffer
  };
}

// https://github.com/aws-samples/amazon-transcribe-websocket-static/blob/master/lib/main.js
const convertAudioToBinaryMessage = function convertAudioToBinaryMessage({
  audioBinary,
  // _pcmEncode = pcmEncode,
  _getAudioEventMessage = getAudioEventMessage,
  _marshaller = (new EventStreamMarshaller(toUtf8, fromUtf8)),
}) {
  // audio data should already be encoded as 16-bit PCM
  // with a sample rate of 16000...
  const pcmBuffer = audioBinary;
  // const pcmBuffer = buffer.transcode(audioBinary, 'binary', 'utf8');
  const audioEventMessage = _getAudioEventMessage(pcmBuffer);
  const binary = _marshaller.marshall(audioEventMessage);
  return binary;
};

export default convertAudioToBinaryMessage;
