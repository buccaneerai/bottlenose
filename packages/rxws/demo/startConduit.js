import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

import { conduit } from '../src/index';

const startConduit = function startConduit({url = 'ws://localhost:3002'}) {
  const data$ = interval(3000).pipe(
    map(t => JSON.stringify({message: `data ${t}`})),
  );
  const socket$ = data$.pipe(conduit({url}));
  socket$.subscribe(
    data => console.log('Conduit.out', data),
    err => console.error('Conduit.err', err),
    () => console.log('Conduit.complete')
  );
};

startConduit({});
