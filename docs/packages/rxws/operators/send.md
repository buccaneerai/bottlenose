## Description

Broadcast (emit) messages to the server. By default, it sends to the 'message' topic.

## Usage

**Basic Usage**:
```javascript
import { from } from 'rxjs';
import { send, ws } from '@bottlenose/rxws';

const messagesToSend$ = from([
  {body: 'data'},
  {body: 'more data'},
]);
const ws$ = ws({url: 'wss://mysite.com'});
const messages$ = ws$.pipe(
  send(messagesToSend$)
);

messages$.subscribe(); // this will attempt to send the messages to the server
```

## API
```typescript
send(
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
