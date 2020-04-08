// socket events
export const CLIENT_GET = 'sockets/GET';
export const CLIENT_CREATE = 'sockets/CREATE';
export const SOCKET_ERROR = 'sockets/ERROR';
export const SOCKET_READY = 'sockets/READY';
export const PING = 'sockets/PING';
export const PONG = 'sockets/PONG';
// connection events
export const CONNECT = 'connections/CONNECT';
export const CONNECT_ERROR = 'connections/ERROR';
export const CONNECT_TIMEOUT = 'connections/TIMEOUT';
export const DISCONNECT = 'connections/DISCONNECT';
export const RECONNECT = 'connections/RECONNECT';
export const RECONNECTING = 'connections/RECONNECTING';
export const RECONNECT_DONE = 'connections/RECONNECT_DONE';
export const RECONNECT_ERROR = 'connections/RECONNECT_ERROR';
export const RECONNECT_FAILED = 'connections/RECONNECT_FAILED';
// messages
export const NEW_MESSAGE = 'messages/NEW';

export const connect = function connect(startTime) {
  return {
    type: CONNECT,
    data: {startTime: startTime || new Date()}
  };
};

export const connectError = function connectError({error}) {
  return {error, type: CONNECT_ERROR};
};

export const connectTimeout = function connectTimeout({timeout}) {
  return {type: CONNECT_TIMEOUT, data: {timeout}};
};

export const createClient = function createClient({client}) {
  return {type: CLIENT_CREATE, data: {client}};
};

export const getClient = function getClient({client}) {
  return {type: CLIENT_GET, data: {client}};
};

export const disconnect = function disconnect({reason}) {
  return {type: DISCONNECT, data: {reason}};
};

export const newMessage = function newMessage({topic, message}) {
  return {type: NEW_MESSAGE, data: {message, topic}};
};

// export const publishReady = function publishReady({subject}) {

// };

export const ping = function ping() {
  return {type: PING, data: {}};
};

export const pong = function pong({latency}) {
  return {type: PONG, data: {latency}};
};

export const reconnect = function reconnect({attemptNumber}) {
  return {type: RECONNECT, data: {attemptNumber}};
};

export const reconnecting = function reconnecting({attemptNumber}) {
  return {type: RECONNECTING, data: {attemptNumber}};
};

export const reconnectFailed = function reconnectFailed({attemptNumber}) {
  return {type: RECONNECT_FAILED, data: {attemptNumber}};
};

export const reconnectDone = function reconnectDone(startTime) {
  return {type: RECONNECT_DONE, startTime: startTime || new Date()};
};

export const reconnectError = function reconnectError({error}) {
  return {error, type: RECONNECT_ERROR};
};

export const socketConnect = function socketConnect({client}) {
  return {type: CONNECT, data: {client}};
};

export const socketError = function socketError(error) {
  return {error, type: SOCKET_ERROR};
};
