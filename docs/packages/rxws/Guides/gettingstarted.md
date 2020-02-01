# Quick Start

## Installation
### npm

```bash
npm i @bottlenose/rxws --save
```

### yarn

```bash
yarn add @bottlenose/rxws
```

## Open a two-way data stream over a WebSocket
The most common use for WebSockets is to open a bi-directional data stream to publish messages to the server and receive messages back from it.  The package provides a `conduit` operator for this purpose:
```javascript
import { from } from 'rxjs';
import { conduit } from '@bottlenose/rxws';

const messagesToSend$ = from([
  {body: 'data'},
  {body: 'more data'},
]);

// send messages over the WebSocket and receive messages back from it...
const socketResponse$ = messageToSend$.pipe(
  conduit({url: 'wss://mysite.com'})
);
socketResponse$.subscribe(
  console.log, // log all messages received from the server
  console.error,
  () => console.log('WebSocket Closed!')
);
```

By default, messages are expected to be encoded as JSON objects.  You can alter this by providing a serializer and deserializer:
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

## Next steps

* Check out the [full API](https://brianbuccaneer.gitbook.io/rxws/api).

