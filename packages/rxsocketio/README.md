[![CircleCI](https://circleci.com/gh/buccaneerai/bottlenose/tree/master.svg?style=shield)](https://circleci.com/gh/buccaneerai/bottlenose/tree/master)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
<a href="https://www.npmjs.com/package/@bottlenose/rxsocketio">
  <img src="https://img.shields.io/npm/v/@bottlenose/rxsocketio.svg" alt="Version">
</a>

## Description
`@bottlenose/rxsocketio` is part of the [Bottlenose](https://github.com/buccaneerai/bottlenose) project.  It is a simple, lightweight package which makes it easy to create two-way data streams using Socket.io and RxJS's pipeable operators.  Its intent is to encapsulate common websocket patterns (that normally require dozens or hundreds of lines of code to implement) into one-line operators that rely on convention and configuration instead of muddying up your codebase.

## Installation
```bash
npm i @bottlenose/rxsocketio --save
```
Or...
```bash
yarn add @bottlenose/rxsocketio
```

## Compatability

| Platform | Support |
| :--- | :--- |
| node.js \(&gt;10.0\) | ✅ |
| Browsers | ✅ |
| React Native | ✅ |
| Electron | ✅ |

## Documentation & Guides
- [Documentation & Guides](https://buccaneerai.gitbook.io/bottlenose/sources-and-sinks/rxsocketio)

## Basic Usage
```js
import {from} from 'rxjs';
import {conduit} from '@bottlenose/rxsocketio';

const messageIn$ = from([
  {topic: 'message', body: 'yarrr'},
  {topic: 'message', body: 'arrr matey'},
  {topic: 'message', body: 'Vitamin C? Never heard of it.'},
]);

const socketConfig = {
  url: 'http://localhost:9080/ws', // socket.io server
  topics: ['message'], // topics to subscribe to. (Defaults to ['message']).
}; 
// the conduit operator sends messages from messageIn$ and emits messages 
// from the server
const messageBack$ = messageIn$.pipe(conduit({...socketConfig}));
messageBack$.subscribe(console.log);
// {topic: 'message', body: 'Welcome Matey.'}
// {topic: 'message', body: 'Yo ho. Yo ho. I am a message from the server.'}
```

The library also supports some advanced features commonly needed in real applications (like sending binary, verifying receipt of messages before sending the next, customizing the socket.io client, serializers/deserializers and handling disconnections).  See the documentation for more information.

