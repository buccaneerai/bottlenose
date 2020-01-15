# connections

## Description

Filters the `rxws` stream to include only connection events. This will emit an event whenever the client connects \(or reconnects\) to the server.

### Usage

```javascript
import { share } from 'rxjs/operators';
import { ws, connections } from '@bottlenose/rxws';

const websocketParams = {
  url: 'wss://mysite.com',
};
const ws$ = ws(websocketParams).pipe(share()); // create a websocket Subject
const connection$ = ws$.pipe(
  connections()
);
connection$.subscribe(() => console.log('You have reconnected to the server!'));
// This would log events whenever the client connects to the server
```

## API

```text
connections()
```

### Since

1.0

### Parameters

None

### Options

None

### Returns

`{attemptNumber<Number>,startTime<Date>}`: An Object which may include the startTime of the connection and the attemptNumber.

