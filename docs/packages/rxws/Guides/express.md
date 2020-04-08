# Demo: Hello World \(Express Server\)

{% hint style="warning" %}
For the purpose of simplicity, this example uses an insecure WS connection to a local server. WS should never be used to communicate over the public internet because it is unencrypted and vulnerable to man-in-the-middle attacks. Instead, a secure and encrypted websocket connection \(like WSS\) should be used.
{% endhint %}

{% hint style="info" %}
**Dependencies**. Running it requires node.js and yarn to be installed locally. (It has been tested with node 12, yarn 1.21.)
{% endhint %}

## Express.js demo
The source code for `@bottlenose/rxws` includes a demo that uses an express.js WebSocket server and connects to it using the `conduit` operator.  If you don't want to run the demo or copy the source code, you can simply [view it on Github](https://github.com/buccaneerai/bottlenose/tree/dev/packages/rxws/demo).

To run the demo locally, first install the dependencies (see above). Then follow the steps below:

### Copy & install the source code
The demo lives in the Bottelnose repository on Github.
```bash
git clone https://github.com/buccaneerai/bottlenose.git
cd bottlenose
yarn install
yarn bootstrap
```

### Run the server
To start the local server, run the following commands from the root of the repository:
```bash
cd packages/rxws
yarn demo:server
```
You should now have a working WebSocket server!  (You can its source code in `packages/rxws/demo/startServer.js`.)

### Send and receive messages over a Websocket!
Open another terminal window and run the websocket rxws Websocket conduit. (Make sure your working directory is `packages/rxws`--same as the previous step.)
```bash
yarn demo:conduit
```
You should now have a working WebSocket client.  (You can see its source code in `packages/rxws/demo/startConduit.js`.)

If you open the terminal window with the client, you will see the messages it is receiving from the server.  If you open the window running the Express server, you should see it receiving messages from the client. 

