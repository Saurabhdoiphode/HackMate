const { Server } = require('socket.io');

let io;

function initSockets(server) {
  io = new Server(server, {
    cors: { origin: '*' }
  });

  io.on('connection', socket => {
    console.log('socket connected', socket.id);

    socket.on('join-room', ({ roomId, userId }) => {
      socket.join(roomId);
      socket.to(roomId).emit('user-joined', { userId });
    });

    socket.on('team-message', ({ roomId, message, from }) => {
      io.to(roomId).emit('team-message', { message, from, timestamp: Date.now() });
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected', socket.id);
    });
  });
}

module.exports = { initSockets };
