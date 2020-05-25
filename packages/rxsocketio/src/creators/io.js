import toPairs from 'lodash/toPairs';
import socketIO from 'socket.io-client';
import {Observable,of,throwError} from 'rxjs';
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

const eventHandlerMap = {
  connect: () => actions.connect(),
  connect_error: error => actions.connectError({error}),
  connect_timeout: timeout => actions.connectTimeout({timeout}),
  disconnect: reason => actions.disconnect({reason}),
  reconnect: attemptNumber => actions.reconnect({attemptNumber}),
  reconnecting: attemptNumber => actions.reconnecting({attemptNumber}),
  reconnect_error: error => actions.reconnectError({error}),
  reconnect_failed: attemptNumber => actions.reconnectFailed({attemptNumber}),
  ping: () => actions.ping(),
  pong: latency => actions.pong({latency}),
};

function socketEventReducer(client, obs) {
  return (acc, [eventName, handler]) => (
    client.on(eventName, (...args) => obs.next(handler(...args)))
  );
}

function createTopicEmitter(obs, _actions = actions) {
  return topic => message => obs.next(_actions.newMessage({topic, message}));
}

function handleTopic(client, obs, emitMessage) {
  return topic => client.on(topic, emitMessage(topic));
}

function createObservableFromSocket(
  client,
  topics,
  _actions = actions,
  _eventHandlerMap = eventHandlerMap,
) {
  const topicBlacklist = Object.keys(_eventHandlerMap);
  if (topicBlacklist.find(key => topics.indexOf(key) > -1)) {
    return throwError(new Error(
      `These topics are reserved and cannot be subscribed to: ${topicBlacklist}`
    ));
  }
  return new Observable(obs => {
    obs.next(_actions.createClient({client}));
    // map Socket.io events to Observable events
    toPairs(_eventHandlerMap).reduce(socketEventReducer(client, obs), undefined);
    // listen for the topics that the client has subscribed to
    const emitMessageToObs = createTopicEmitter(obs);
    topics.map(handleTopic(client, obs, emitMessageToObs));
    client.on('error', error => obs.error(error));
  });
}

// Create an observable from a Socket.io client:
const io = function io({
  url,
  topics = ['message'],
  socketOptions = {},
  stop$ = of(),
  _socketIO = socketIO,
  _createObservableFromSocket = createObservableFromSocket,
}) {
  if (!url) return throwError(new Error('io creator requires a url<String>'));
  const client = _socketIO.connect(url, {...defaultOptions, ...socketOptions});
  const action$ = _createObservableFromSocket(client, topics);
  return action$.pipe(
    map(action => [client, action]),
    takeUntil(stop$.pipe(
      tap(() => client.disconnect())
    )),
    shareReplay(1)
  );
};

export const testExports = {
  createObservableFromSocket,
  createTopicEmitter,
  handleTopic,
  socketEventReducer
};
export default io;
