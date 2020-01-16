# Example: Hello World \(Express\)

{% hint style="warning" %}
For the purpose of simplicity, this example uses an insecure WS connection to a local server. WS should never be used to communicate over the public internet because it is unencrypted and vulnerable to man-in-the-middle attacks. Instead, a secure and encrypted websocket connection \(like WSS\) should be used.
{% endhint %}

## Setup workspace

This example requires node.js and `npm` \(or `yarn`\) to be installed locally. To create a workspace using `npm`:

```bash
mkdir ./rxws-hello-world && cd ./rxws-hello-world
npm init -y
npm i --save express ws rxjs @bottlenose/rxws
touch startServer.js startClient.js
```

Or with yarn:

```bash
mkdir ./rxws-hello-world && cd ./rxws-hello-world
yarn init -y
yarn add express ws rxjs @bottlenose/rxws
touch startServer.js startClient.js
```

## Create a simple WebSocket server

Add this code to `startServer.js`:

```javascript
// startServer.js
import express from 'express';
import http from 'http';
import ws from 'ws';

// setup a basic WebSocket server using ws
function startServer(port) {
  const app = express();
  const server = http.createServer(app);
  const io = ws(server);

  // Emit welcome message on connection
  io.on('connection', (socket) => {
    // Use socket to communicate with this particular client only, sending it it's own id
    socket.emit('welcome', { message: 'Ahoy matey!', id: socket.id });
    socket.on('fromclient', console.log);
    // Send a message every 3 seconds:
    setInterval(
      () => socket.emit(
        'message',
        { text: 'Aye aye!', sentAt: new Date().toJSON() }
      ),
      3000
    );
  });
  server.listen(port, () => console.log(`⛵ Listening on ${port}`));
}

startServer(process.env.PORT);
```

This particular example uses a [isomorphic-ws](https://www.npmjs.com/package/isomorphic-ws) server but any WebSocket server would do the trick. Now run the server:

```bash
PORT=3002 node ./startServer.js
```

💡 **Tip**: Some systems install node.js `nodejs` instead of `node`. You might need to tweak the command for your local system.

## Create an `rxws` client

Now, let's connect the the WebSocket server and communicate with it. Copy this code into `startClient.js`:

```javascript
import { interval } from 'rxjs';
import { map, share } from 'rxjs/operators';
import {broadcast, connections, disconnections, messages, ws} from '@bottlenose/rxws';

function startClient(url) {
  // create a hot observable with the websocket client
  const ws$ = ws({url}).pipe(share());

  // get connection events
  const disconnection$ = ws$.pipe(disconnections()); // disconnection events
  const connection$ = ws$.pipe(connections()); // connection events

  // events emitted to the 'welcome' topic
  const welcome$ = ws$.pipe(messages('welcome'));
  // events emitted to the 'message' topic
  const message$ = ws$.pipe(messages());

  // send a message to the server every 5 seconds
  const sendMessage$ = interval(5000).pipe(
    map(index => ({text: 'Aaaaarrrrr matey', index}))
  );
  const publish$ = ws$.pipe(broadcast(sendMessage$, 'fromclient'));

  // subscribe to the observables to start running them:
  connection$.subscribe(c => console.log('connected to server', c));
  disconnection$.subscribe(d => console.log('disconnected from server', d));
  welcome$.subscribe(m => console.log('welcome received from server:', m));
  message$.subscribe(m => console.log('message received from server:', m));
  publish$.subscribe(null, err => console.log('error sending messages:', err));
}

startClient(process.env.SERVER_URL);
```

Now open another Terminal window and start the client:

```bash
SERVER_URL='ws://localhost:3002' node ./startClient.js
```

That's it! In the terminal window where the client is running, you should see a stream of messages being logged as it connects to the server and receives messages from the server. If you open the terminal window where the server is running, you should see it log messages from the client.

What if connection is interrupted? You can simulate this by terminating the server. The client will emit a disconnection event. It will then try to reconnect to the server. If you restart the server, then it will connect again and their bi-directionl communication will continue.

