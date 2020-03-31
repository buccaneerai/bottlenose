# conduit

## Description

Opening a two-way WebSocket is a very common software pattern.  The `conduit` operator makes it trivially easy to initiate this exchange with a Socket.io server.  It pipes an Observable into a two-way websocket. Each item in the Observable will be published to the server. The output stream will be the messages sent from the server to the client.

## Usage

**Basic Usage**:
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

## API

```
conduit({
  url<String>,
  [topics[String]],
  [socketOptions[Object]]
})
```

### Since

0.5

### Parameters

* `url<String>`: The URL of the backend server (like "http://localhost:3000").

### Options
* `topics[String]`: Topics to subscribe to when receiving messages from the server. Defaults to `['message']`.
* `socketOptions[Object]`: Options to pass into the [socket.io Manager](https://socket.io/docs/client-api/).
* `stop$[Observable]`: The conduit and its observable will terminate (and disconnect) if the stop$ observable emits any items. 

### Returns
<Any> Returns the stream of messages from the server.