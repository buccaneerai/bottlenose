# disconnections

## Description

Filters the `rxws` stream to include only disconnection events.  This will emit an event whenever the client disconnects from the server.

### Usage
```javascript
import { share } from 'rxjs/operators';
import { ws, disconnections } from '@buccaneer/rxws';

const websocketParams = {url: 'wss://mysite.com'};
const ws$ = ws(websocketParams).pipe(share()); // create a websocket Subject
const disconnection$ = ws$.pipe(
  disconnections()
);
disconnection$.subscribe(() => console.log('You have disconnected from the server!'));
// This would log events whenever the client connects to the server
```

## API
```
disconnections()
```

### Since
1.0

### Parameters
None

### Options
None

### Returns
`{reason<String>}`: An Object which may include the reason for the disconnect.