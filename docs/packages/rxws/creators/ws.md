# ws

## Description

Creates an [isomorphic-websocket client](https://www.npmjs.com/package/isomorphic-ws) wrapped in an Observable.  The Observable is a vanilla RxJS Observable which emits actions and exposes its API using [rxws operators](https://brianbuccaneer.gitbook.io/rxws/api/operators).

## Usage
```javascript
import { share } from 'rxjs/operators';
import { ws, messages } from '@buccaneer/rxws';

// create a websocket
const websocketParams = {
  url: 'wss://mysite.com',
  topics: ['message', 'news'],
};
const ws$ = ws(websocketParams).pipe(
  share() // create the websocket and multicast it into an RxJS Subject
);

// get messages from the websocket:
const message$ = ws.pipe(
  messages()
);

message$.subscribe(console.log);
// This would log the messages received from the server
```

## API
```
ws({
  url,
  topics=['message'],
  socketOptions={transports: ['websocket']}
})
```

### Since
1.0

### Parameters
  * `url<String>`: The URL of the Websocket server

### Options
  * `topics[<String>]`: An array of the topics to which the WebSocket client should subscribe. Defaults to `['message']`.
  * `socketOptions`: An object containing [isomorphic-websocket client options](https://www.npmjs.com/package/isomorphic-ws).

### Returns
`Observable`. An RxJS Observable.  This contains a stream of events.  The websocket is intended to be used with rxws operators.


