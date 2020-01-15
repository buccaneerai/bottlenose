# client

## Description

Maps a websocket stream into the raw WebSocket client (which is [socket.io client](https://github.com/socketio/socket.io-client/blob/master/docs/API.md)).

### Usage
```javascript
import { share } from 'rxjs/operators';
import { ws, client } from '@bottlenose/rxws';

const websocketParams = {
  url: 'wss://mysite.com',
  topics: ['message', 'news'],
};
const ws$ = ws(websocketParams).pipe(share()); // create a websocket Subject
const client$ = ws$.pipe(
  client()
);
client$.subscribe(console.log);
// This would log the socket.io object
```

## API
```
client()
```

### Since
1.0

### Parameters
None

### Options
None

### Returns
`Socket`. The raw WebSocket client, which is a [socket.io client](https://github.com/socketio/socket.io-client/blob/master/docs/API.md) object.