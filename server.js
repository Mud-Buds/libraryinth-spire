require('dotenv').config();
require('./lib/utils/connect')();
const mongoose = require('mongoose');

mongoose.connection.dropDatabase();

const library = require('./lib/rooms/library');
const horrorRoom = require('./lib/rooms/horror');
const sciFiRoom = require('./lib/rooms/sci-fi');
const fantasyRoom = require('./lib/rooms/fantasy');

Promise.resolve(library())
  .then(() => horrorRoom())
  .then(() => sciFiRoom())
  .then(() => fantasyRoom());

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
const { chatParser, chatAnnounce } = require('./lib/helpers/chatParser');
const { commandParser } = require('./lib/helpers/commandParser');

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

  // can be used for auto login on connect if token is present
  // socket.on('authenticate', (input) => {
  //   const user = User.verifyToken(input);
  //   user.socket = socket.id;
  //   user.save();
  //   socket.request.user = user;
  // });

  // originally, delay helped with auto login after User.verifyToken() to show user joining, not guest
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
      commandParser(input, socket, 'chat')
        .then(res => {
          // console.log(res);
          // console.log('socketme', socket.id);
          // handle emotes
          if(res.type === 'emote'){
            io.emit('chat', {
              ...res,
              msg: socket.request.user.username + ' ' + res.msg 
            });
          }
          // handle whispers with a to message to client and from message to recipient
          else if('toUser' in res) {
            if(io.sockets.connected[res.toUser]){
              // show whisper sent from client to client
              socket.emit('chat', { 
                ...res,
                msg: 'to ' + res.toUsername + ': ' + res.msg
              });
              // show whisper from client to recipient
              io.to(res.toUser).emit('chat', { 
                ...res,
                msg: 'from ' + socket.request.user.username + ': ' + res.msg 
              });
            } else {
              // recipient is not online
              socket.emit('chat', {
                msg: 'User ' + res.toUsername + ' is not online',
                color: 'lightcoral'
              });
            }
          } else {
            // show copy of command entered if not matched before now (basically echo non-chat commands)
            socket.emit('chat', {
              msg: '> <span style="font-style: italic;">' + input + '</span>',
              color: 'grey',
              html: true
            });
            // parsed command response in chat (things like login/signup success/error)
            socket.emit('chat', res);
            // announce username change
            if(res.announce) chatAnnounce(res.announce, io);
          }
        })
        .catch(res => socket.emit('chat', res));
    } else {
      // standard chat response (to all)
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
      commandParser(input, socket, 'game')
        .then(res => {
          // announce username change
          if(res.announce) chatAnnounce(res.announce, io);
          console.log(res);
          return res;
        })
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
