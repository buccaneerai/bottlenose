Bottlenose doesn't have a module for HTTP data sources because it's simple to use existing libraries for this purpose.

With [request-promise-native](https://www.npmjs.com/package/request-promise) (based the [request](https://www.npmjs.com/package/request) npm package for node.js):
```javascript
import {from} from 'rxjs';
import request from 'request-promise-native';

const req$ = from(request({method: 'GET', uri: 'https://google.com'}));
req.subscribe(console.log);
```

With `axios` (isomorphic):
```javascript
import {from} from 'rxjs';
import axios from 'axios';

const req$ = from(axios.get('https://google.com'));
req.subscribe(console.log);
```

Other useful libraries:
- [superagent]
- [graphql-request]