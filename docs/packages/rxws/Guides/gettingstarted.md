# Quick Start

### npm

```bash
npm i @bottlenose/rxws --save
```

### yarn

```bash
yarn add @bottlenose/rxws
```

## Subscribe to messages from a server

```javascript
import { share } from 'rxjs/operators';
import { messages, ws } from '@bottlenose/rxws';

const websocketParams = {
  url: 'wss://mysite.com',
  topics: ['message', 'news'],
};
const ws$ = ws(websocketParams).pipe(
  share() // pipe the Observable to a Subject
);

// get a stream of messages from the server:
const message$ = ws$.pipe(
  messages() // get all messages from the WebSocket.
);
message$.subscribe(console.log); // log messages from the server
```

## Publish messages to a server

```javascript
import { from } from 'rxjs';
import { share } from 'rxjs/operators';
import { broadcast, ws } from '@bottlenose/rxws';

const ws$ = ws({url: 'wss://mysite.com'}).pipe(share());

// send a stream of messages to the server:
const messagesToPublish$ = from([
  {text: 'hello'},
  {text: 'goodbye'},
]);
const publisher$ = ws$.pipe(
  broadcast(messagesToPublish$, 'post')
);
publisher$.subscribe();
```

## Handle interruptions to the client's connection

```javascript
import { share } from 'rxjs/operators';
import { connections, disconnections, ws } from '@bottlenose/rxws';

const websocketParams = {
  url: 'wss://mysite.com',
  topics: ['message', 'news']
};
const ws$ = ws(websocketParams).pipe(share());

const disconnection$ = ws$.pipe(
  disconnections()
);
disconnection$.subscribe(
  () => console.log('You are disconnected from the server!')
);
const reconnection$ = ws$.pipe(
  connections()
);
reconnection$.subscribe(
  () => console.log('You have reconnected to the server!')
);
```

## Next steps

* Check out the [full API](https://brianbuccaneer.gitbook.io/rxws/api).

