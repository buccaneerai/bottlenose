// https://www.npmjs.com/package/isomorphic-ws
import WS from 'isomorphic-ws';
import { Observable } from 'rxjs';
import { filter, map, shareReplay, takeUntil } from 'rxjs/operators';

import * as actions from '../internals/actions';

const ws = function ws({
  url,
  protocols = null,
  socketOptions = {},
  stop$ = new Observable(),
  _createSocket = (_url, _socketOptions) => new WS(_url, _socketOptions),
  _actions = actions,
}) {
  const socket = _createSocket(url, protocols, socketOptions);
  const event$ = new Observable(obs => {
    obs.next(_actions.createClient({client: socket}));
    socket.onopen = e => obs.next(
      _actions.socketConnect({client: socket, event: e,})
    );
    socket.onclose = e => obs.next(_actions.disconnect({event: e}));
    // socket.onerror = error => obs.next(_actions.socketError({error}));
    socket.onerror = error => obs.error(error);
    socket.onmessage = message => obs.next(_actions.newMessage({message}));
  });
  return event$.pipe(
    map(event => [socket, event]),
    filter(data => data.indexOf(undefined) === -1),
    takeUntil(stop$),
    shareReplay(1)
  );
};

export default ws;
