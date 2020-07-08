require('dotenv').config();
require('./lib/utils/connect')();
const mongoose = require('mongoose');

mongoose.connection.dropDatabase();

const library = require('./lib/rooms/library');
const horrorRoom = require('./lib/rooms/horror');

Promise.resolve(library())
  .then(() => horrorRoom());

const app = require('./lib/app');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 7890;
const http = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});
const io = require('socket.io').listen(http);

const { gameParser } = require('./lib/helpers/gameParser');
const { chatParser } = require('./lib/helpers/chatParser');
const { commandParser } = require('./lib/helpers/commandParser');
const User = require('./lib/models/User');

io.use((socket, next) => {
  console.log('io middleware');
  // console.log(Object.keys(socket.request));

  // socket.emit('chat', { msg: 'question?' });

  // ensureAuth?
  // const token = req.cookies.session; // req is express
  // const user = User.verifyToken(token);
  // socket.request.user = user;
  return next();
});

io.on('connection', async(socket) => {

  socket.request.user = {};
  socket.request.user.username = 'guest-' + socket.id.slice(0, 4);

  socket.on('authenticate', (input) => {
    const user = User.verifyToken(input);
    user.socket = socket.id;
    user.save();
    socket.request.user = user;
  });

  const connectedUser = setTimeout(() => {
    console.log(`${socket.id} connected`);
    io.emit('chat', { msg: socket.request.user.username + ' connected' });
  }, 300);

  // display the Message of the Day
  const motdTitle = require('./motd');
  const displayMOTD = setTimeout(() => {
    socket.emit('game', { msg: '<span style="font-size: 10px; color: blue; white-space: pre; font-family: monospace">' + motdTitle + '</span><br /><br /><span style="color:white">MOTD goes here.</span><hr /><br />', color: 'skyblue' });
  }, 2000);

  // right col - The Chat Window
  socket.on('chat', (input) => {
    if(input.slice(0, 1) === '/') {
      // console.log(socket.request.user);
      // console.log(socket.id);
      commandParser(input, socket)
        .then(res => {
          console.log(res);
          if(res.toUser) {
            io.to(res.toUser).emit('chat', {
              msg: 'from ' + socket.request.user.username + ': ' + res.msg
            });
          } else {
            socket.emit('chat', {
              msg: '> <span style="font-style: italic;">' + input + '</span>',
              color: 'grey',
              html: true
            });
            socket.emit('chat', res);
          }
        })
        .catch(res => socket.emit('chat', res));
    } else {
      chatParser(input)
        .then(parsed => io.emit('chat', {
          msg: socket.request.user.username + ': ' + parsed 
        }))
        .catch(res => socket.emit('chat', res));
    }
  });

  // left col - The Game Window
  socket.on('game', (input) => {
    if(input.slice(0, 1) === '/') {
      socket.emit('game', {
        msg: '> <span style="font-style: italic;">' + input + '</span>',
        color: 'grey',
        html: true
      });
      commandParser(input, socket)
        .then(res => socket.emit('game', res))
        .catch(res => socket.emit('game', res));
    } else {
      socket.emit('game', { 
        msg: '> ' + input,
        color: 'burlywood'
      });
      gameParser(input)
        .then(res => socket.emit('game', res))
        .catch(res => socket.emit('game', res));
    }
  });

  // clear timeout on disconnect
  socket.on('disconnect', () => {
    console.log(`${socket.request.user.username} disconnected`);
    clearTimeout(displayMOTD);
    clearTimeout(connectedUser);
  });
});
