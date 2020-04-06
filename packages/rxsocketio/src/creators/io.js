import socketIO from 'socket.io-client';
import {Observable,of} from 'rxjs';
import {map,shareReplay,takeUntil,tap} from 'rxjs/operators';

import * as actions from '../internals/actions';

// https://socket.io/docs/client-api/#new-Manager-url-options
const defaultOptions = {
  forceNew: true,
  reconnection: true,
  timeout: 10000,
  autoConnect: true,
  path: '/',
  query: {},
  json: true,
  upgrade: true,
};

// how to handle Auth? ideally, like this: {query: {token}}, which does this: http://localhost?token=abc
// how to handle WSS?
const io = function io({
  url,
  topics = ['message'],
  socketOptions = {},
  stop$ = of(),
  _socketIO = socketIO,
  _actions = actions
}) {
  const ioOptions = {...defaultOptions, socketOptions};
  const client = _socketIO(url, ioOptions);
  const action$ = new Observable(obs => {
    obs.next([client, _actions.createClient({client})]);
    client.on('connect', () => obs.next(_actions.connect()));
    client.on('connect_error', error => obs.next(
      _actions.connectError({error})
    ));
    client.on('connect_timeout', timeout => obs.next(
      _actions.connectTimeout({timeout})
    ));
    client.on('disconnect', reason => obs.next(
      _actions.disconnect({reason})
    ));
    client.on('reconnect', attemptNumber => obs.next(
      _actions.reconnect({attemptNumber})
    ));
    client.on('reconnecting', attemptNumber => obs.next(
      _actions.reconnecting({attemptNumber})
    ));
    client.on('reconnect_error', error => obs.next(
      _actions.reconnectError({error})
    ));
    client.on('reconnect_failed', attemptNumber => obs.next(
      _actions.reconnectFailed({attemptNumber})
    ));
    client.on('ping', () => obs.next(
      _actions.ping(),
    ));
    client.on('pong', latency => obs.next(
      _actions.pong({latency}),
    ));
    topics.map(topic => (
      client.on(topic, message => obs.next(
        _actions.newMessage({topic, message})
      ))
    ));
    client.on('error', error => obs.error(error));
  });
  return action$.pipe(
    map(action => [client, action]),
    takeUntil(stop$.pipe(
      tap(() => client.disconnect())
    )),
    shareReplay(1)
  );
};

export default io;
