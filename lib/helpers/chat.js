const isCommand = input => input[0] === '/';

const constructMessage = (input, socket) => `${socket.request.user.username}: ${input}`

// break up logic into functions
const handleEmote = (command, socket, io) => {
  io.to('chat').emit('chat', {
    ...command,
    msg: constructMessage(input, socket)
  });
};

const handleToUser = (command, socket, io) => {
  if(!io.sockets.connected[command.toUser]) {
    socket.emit('chat', {
      msg: `User ${command.toUsername} is not online`,
      style: 'error'
    });
    return;
  }

  socket.emit('chat', {
    ...command,
    msg: `to ${command.toUsername}: command.msg`
  });

  io.to(res.toUser).emit('chat', { 
    ...command,
    msg: 'from ' + socket.request.user.username + ': ' + res.command 
  });
};

const commands = {
  emote: handleEmote,
  toUser: handleToUser
}

const handler = (input, socket, io) => {
  if(!isCommand(input)) io.to('chat').emit('chat', {
    msg: constructMessage(input, socket)
  });

  return commandParser(input, socket, 'chat', io)
    .then(command => commands[command.type](command, socket, io))
};

module.exports = handler;
