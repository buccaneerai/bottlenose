# Quick Start

## Installation
### npm

```bash
npm i @bottlenose/rxsocketio --save
```

### yarn

```bash
yarn add @bottlenose/rxsocketio
```

## Open a two-way data stream using Socket.io
The most common use for WebSockets is to open a bi-directional data stream to publish messages to the server and receive messages back from it.  The package provides a `conduit` operator for this purpose:
```javascript
import { from } from 'rxjs';
import { conduit } from '@bottlenose/rxsocketio';

const messagesToSend$ = from([
  {body: 'data'},
  {body: 'more data'},
]);

// send messages over the WebSocket and receive messages back from it...
const socketResponse$ = messageToSend$.pipe(
  conduit({url: 'http://mysite.com'})
);
socketResponse$.subscribe(
  console.log, // log all messages received from the server
  console.error,
  () => console.log('Socket Closed!') 
);
```

## Sending messages with a topic
By default, objects piped into the conduit operator are sent to the `'message'` topic.  You can simply add a topic key to the objects to send them to a particular topic:
```javascript
import { from } from 'rxjs';
import { conduit } from '@bottlenose/rxsocketio';

const messagesToSend$ = from([
  {body: 'Network TV is overrated', topic: 'television'},
  {body: 'The Beatles are really, really good.', topic: 'music'},
]);

// send messages over the WebSocket and receive messages back from it...
const socketResponse$ = messageToSend$.pipe(
  conduit({url: 'http://mysite.com', topics: ['television', 'music', 'message']})
);
socketResponse$.subscribe(
  console.log, // log all messages received from the server
  console.error,
  () => console.log('Socket Closed!')
);
```

## Advanced options
You can also provide `socketOptions`, which will be passed into the [Socket.io Manager](https://socket.io/docs/client-api/):
```javascript
import { from } from 'rxjs';
import { conduit } from '@bottlenose/rxsocketio';

const messagesToSend$ = from([
  {body: 'Network TV is overrated', topic: 'television'},
  {body: 'The Beatles are really, really good.', topic: 'music'},
]);

// You can override defaults by passing any of the options that can normally
// be given to a socket.io Manager object:
const socketOptions = {
  query: {token: 'mysuperseeeecrettoken'},
  timeout: 5000,
};

// send messages over the WebSocket and receive messages back from it...
const socketResponse$ = messageToSend$.pipe(
  conduit({url: 'http://mysite.com', socketOptions})
);
socketResponse$.subscribe(
  console.log, // log all messages received from the server
  console.error,
  () => console.log('Socket Closed!')
);
```

