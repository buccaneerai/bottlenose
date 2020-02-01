# conduit

## Description

Opening a two-way WebSocket is a very common software pattern.  The `conduit` operator makes it trivially easy to do this.  It pipes an Observable into a two-way websocket. Each item in the Observable will be published to the server. The output stream will be the messages sent from the server to the client.  

Optionally, it can be performed using a custom serializer or deserializer -- otherwise, it will assume the messages are encoded/decoded as JSON and transmitted as JSON strings.

## Usage

**Basic Usage**:

```javascript
import { from } from 'rxjs';
import { conduit } from '@bottlenose/rxws';

const messagesToSend$ = from([
  {body: 'data'},
  {body: 'more data'},
]);
const socketResponse$ = messageToSend$.pipe(
  conduit({url: 'wss://mysite.com'})
);

socketResponse$.subscribe(); // this will attempt to send the messages to the server
```

**Custom serialization**:
```javascript
import { from } from 'rxjs';
import { conduit } from '@bottlenose/rxws';

const decodeMessage = base64Message => atob(base64Message);
const encodeMessage = binaryString => btoa(binartString);

const messagesToSend$ = from([
  'somebinarystring',
  'anotherbinarystring',
]);
const socketResponse$ = messageToSend$.pipe(
  conduit({
    url: 'wss://mysite.com',
    serializer: encodeMessage,
    deserializer: decodeMessage,
  })
);
socketResponse$.subscribe();
```

## API

```typescript
conduit(
  messagesToSend$<Observable>,
  serializer<Function>=JSON.stringify,
  deserializer<Function>=JSON.parse
)
```

### Since

1.0

### Parameters

* `messagesToSend$<Observable>`: An Observable containing messages that will be sent to the server \(whenever a message is emitted\)

### Options
* `serializer<Function>`: A function to encode messages before they are sent to the server. Defaults to `JSON.stringify`.
* `deserializer<Function>`: A functin to decode messages received from the server. Defaults to `JSON.parse`.

### Returns
<Any> Returns the stream of data from the server.  (The object type and format will be determined by the deserializer function.)

