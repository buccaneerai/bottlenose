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

// maps socket.io events to RxJS events
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

// attach event listeners to Socket.io client
function socketEventReducer(client, obs) {
  return (acc, [eventName, handler]) => (
    client.on(eventName, (...args) => obs.next(handler(...args)))
  );
}

// emit messages to a topic
function createTopicEmitter(obs, _actions = actions) {
  return topic => message => obs.next(_actions.newMessage({topic, message}));
}

// handle all messages to a topic
function handleTopic(client, obs, emitToTopic) {
  return topic => client.on(topic, emitToTopic(topic));
}

// convert Socket.io client to RxJS Observable
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
    const emitToTopic = createTopicEmitter(obs);
    topics.map(handleTopic(client, obs, emitToTopic));
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
  const client = _socketIO(url, {...defaultOptions, ...socketOptions});
  const action$ = _createObservableFromSocket(client, topics);
  return action$.pipe(
    map(action => [client, action]),
    takeUntil(stop$.pipe(
      tap(() => client.disconnect()) // instruct client to disconnect
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
