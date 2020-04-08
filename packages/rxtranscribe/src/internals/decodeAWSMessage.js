import { toUtf8, fromUtf8 } from '@aws-sdk/util-utf8-node';
import { EventStreamMarshaller } from '@aws-sdk/eventstream-marshaller';

// https://github.com/aws-samples/amazon-transcribe-websocket-static/blob/master/lib/main.js
const decodeMessage = function decodeMessage({
  message,
  _marshaller = (new EventStreamMarshaller(toUtf8, fromUtf8))
}) {
  const messageWrapper = _marshaller.unmarshall(Buffer.from(message));
  const messageBody = JSON.parse(
    // eslint-disable-next-line
    String.fromCharCode.apply(String, messageWrapper.body)
  );
  if (messageWrapper.headers[':message-type'].value === 'event') {
    return messageBody;
  }
  // FIXME - should be able to recover from errors...
  throw new Error(messageBody.Message);
};

export default decodeMessage;
