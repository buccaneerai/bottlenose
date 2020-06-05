import ws from 'ws'; // eslint-disable-line import/no-extraneous-dependencies

function startServer(port = 3002) {
  const server = new ws.Server({port});
  // Emit welcome message on connection
  server.on('connection', connection => {
    console.log('🔌 client connected!');
    // Use socket to communicate with this particular client only, sending
    // it's own id
    connection.on('message', console.log);
    // Send current time every 3 secs
    setInterval(
      () => connection.send(JSON.stringify({text: 'Hello, I am the server.'})),
      3000
    );
  });
  // server.listen(port, () => console.log(`🤖 Listening on ${port}`));
}

startServer();
