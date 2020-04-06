# fromIO

## Description
Creates a [Socket.io client (Manager)](https://socket.io/docs/client-api/) wrapped in an RxJS Observable.

## Usage

**Basic Usage**:
```javascript
import { from } from 'rxjs';
import { fromIO } from '@bottlenose/rxsocketio';

// send messages over the WebSocket and receive messages back from it...
const ioEvent$ = fromIO({url: 'http://mysite.com'});
ioEvent$.subscribe(
  console.log, // log all events from the socket.io manager
  console.error,
  () => console.log('Socket Closed!') 
);
```

### Parameters

* `url<String>`: The URL of the backend server (like "http://localhost:3000").

### Options
* `topics[String]`: Topics to subscribe to when receiving messages from the server. Defaults to `['message']`.
* `socketOptions[Object]`: Options to pass into the [socket.io Manager](https://socket.io/docs/client-api/).
* `stop$[Observable]`: The conduit and its observable will terminate (and disconnect) if the stop$ observable emits any items. 

### Returns
Returns the stream of socket.io events where each emitted item has the form [SocketIO.Manager, `{type<String>, data<Object>}`].

Event types include the following:
  * `sockets/CREATE`: {}
  * `connections/CONNECT`: {startTime<Date>}
  * `connections/DISCONNECT`: {reason<String>}
  * `messages/NEW`: {topic<String>,message<Object>}
  * See `rxsocketio/internals/actions.js` for the full list of raw events.