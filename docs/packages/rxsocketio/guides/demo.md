# Demo

This package includes a demo.  You can [view source on GitHub]() and adapt it to your purposes.  Or you can follow these instructions to run it in the bottlenose repository:

First, clone the source code:
```bash
git clone https://github.com/buccaneerai/bottlenose.git
```

Then build the packages in bottlenose:
```bash
cd bottlenose
yarn bootstrap
```

Run a Socket.io server:
```bash
cd packages/rxsocketio
node ./demo/server.js
```
You should now see the server listining on port 3000!

In another window (in the same working directory):
```bash
cd packages/rxsocketio
node ./demo/client.js
```
Now your client should connect to the server to send and receive messages!  In the client logs, you should see it logging messages that it receives from the server.  In the server logs, you should it logging messages it receives from the client.