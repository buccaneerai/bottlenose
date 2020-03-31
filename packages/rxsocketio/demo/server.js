const http = require('http');
const socketIO = require('socket.io');

const port = 3000;
const server = http.createServer();

const io = socketIO(server, {
  path: '/',
  serveClient: false,
  // below are engine.IO options
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});

io.on('connection', socket => {
  console.log('CLIENT CONNECTED!');
  socket.emit('message', 'Welcome!');
  socket.on('disconnect', () => console.log('DISCONNECTED!'));
  socket.on('message', message => console.log('MESSAGE_RECEIVED: ', message));
  let messageCount = 0;
  setInterval(() => {
    messageCount += 1;
    socket.emit('message', {content: `MESSAGE_NUM:${messageCount}`});
  }, 3000);
});

server.listen(port, () => console.log(`Listening on port ${port}`));
