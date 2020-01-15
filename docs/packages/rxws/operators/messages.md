## Description

Listen for all message events from the WebSocket client.

## Usage

**Basic Usage**:
```javascript
import { messages, ws } from '@bottlenose/rxws';

const ws$ = ws({url: 'wss://mysite.com'});
const messages$ = ws$.pipe(
  messages()
);

messages$.subscribe(console.log);
// Output
// {topic: 'message', message: 'first message'}
// {topic: 'message', message: 'second message'}
```

**With a topic**:
```javascript
import { messages, ws } from '@bottlenose/rxws';

const ws$ = ws({url: 'wss://mysite.com', topics: ['news']});
const messages$ = ws$.pipe(
  messages('news')
);

messages$.subscribe(console.log);
// Output
// {topic: 'news', message: 'first message'}
// {topic: 'news', message: 'second message'}
```

## API
```
messages(topic = 'message')
```

### Since
1.0

### Parameters
None

### Options
`topic<String>`: specific topics to subscribe to. Defaults to `'message'`.

### Returns
`{topic<String>,message<Any>}`
