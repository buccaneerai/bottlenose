## Description

Pipe an Observable into a two-way websocket. Each item in the Observable will be emitted to the server. The output stream will be the messages sent from the server to the client.

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

## API
```typescript
conduit(
  messagesToSend$<Observable>,
  topic<String> = 'message'
)
```

### Since
1.0

### Parameters
* `messagesToSend$<Observable>`: An Observable containing messages that will be sent to the server (whenever a message is emitted)
* `topic<String>`: The topic to which the events should be published. Defaults to `'message'`.

### Options
None

### Returns
`{topic<String>,message<Any>}`
