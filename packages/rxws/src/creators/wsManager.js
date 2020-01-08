import {BehaviorSubject, Observable, timer} from 'rxjs';
import {map, mapTo, mergeMap, scan, takeUntil, tap} from 'rxjs/operators';

import ws from './ws';
import * as actions from '../internals/actions';

const managedWs = function managedWs({
  url,
  socketOptions = {},
  stop$ = new Observable(),
  reconnectInterval = 3000,
  connectionTimeout = 3000,
  // bufferOnDisconnect = true,
  // binaryType = 'blob'
  _ws = ws,
  _actions = actions
}) {
  const disconnection$ = new BehaviorSubject();
  const ws$ = disconnection$.pipe(
    scan(([index]) => [index + 1], [-1]),
    mergeMap(([index]) => (
      // attempt reconnection every few seconds if disconnected
      timer(index === 0 ? 0 : reconnectInterval).pipe(
        mapTo([
          ws({url, socketOptions}),
          _actions.reconnect(index)
        ]),
        mergeMap(([_ws$, reconnectingAction]) => (
          _ws$.pipe(
            map(([socket, action]) => [
              socket,
              action
              // index > 0 // Subsequent connections are RECONNECT _actions instead
              // && action
              // && action.type
              // && action.type === _actions.CONNECT
              // ? _actions.reconnectDone(index)
              // : action
            ])
          )
        ))
      )
    )),
    takeUntil(stop$),
    tap(([,event]) => (
      event.type === _actions.DISCONNECT
      ? disconnection$.next(event)
      : null
    ))
  );
  return ws$;
};

export default managedWs;
