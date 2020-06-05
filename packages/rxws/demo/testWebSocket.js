import { from, interval } from 'rxjs';
import takeRight from 'lodash/takeRight';
import { scan, map, share, tap } from 'rxjs/operators';

import {
  conduit
  // send,
  // client,
  // connections,
  // disconnections,
  // consume,
  // ws,
  // wsManager as ws
} from '../src/index';

function startClient(
  url = 'ws://localhost:3002',
) {
  // const ws$ = ws({url}).pipe(
    // tap(([,e]) => console.log('EVENT', e)),
    // share()
  // );
  const messageIn$ = interval(5000).pipe(
    scan((acc) => acc + 1, -1),
    map(index => ({body: 'Hello, I am the client!', index}))
  );
  const messageOut$ = messageIn$.pipe(conduit({url}));
  messageOut$.subscribe(
    d => console.log('message', d),
    err => console.log(err),
    () => console.log('DONE')
  );
  // const client$ = ws$.pipe(client());
  // const disconnect$ = ws$.pipe(disconnections());
  // const connect$ = ws$.pipe(connections());
  // const message$ = ws$.pipe(consume());
  // const sendMessage$ = interval(5000).pipe(
  //   map(i => ({text: 'foo', i}))
  // );
  // const publish$ = ws$.pipe(send(sendMessage$));
  // client$.subscribe(c => console.log('CLIENT', c));
  // connect$.subscribe(c => console.log('CONNECT', c));
  // disconnect$.subscribe(d => console.log('DISCONNECT', d));
  // message$.subscribe(m => console.log('MESSAGE', m));
  // publish$.subscribe(
  //   r => console.log('RESPONSE', r),
  //   err => console.log('BROADCASE ERR', err),
  //   () => console.log('BROADCAST DONE')
  // );
}

startClient();
