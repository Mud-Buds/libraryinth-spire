require('dotenv').config();
require('./lib/utils/connect')();
const mongoose = require('mongoose');



const library = require('./lib/rooms/library');
const horrorRoom = require('./lib/rooms/horror');
const sciFiRoom = require('./lib/rooms/sci-fi');
const fantasyRoom = require('./lib/rooms/fantasy');

// create rooms - originally Promised to create off of instance of users
// need to wait for database to finish dropping
mongoose.connection.dropDatabase()
  .then(() => {
    library();
    horrorRoom();
    sciFiRoom();
    fantasyRoom();
  });

const app = require('./lib/app');

// client
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

  // ensureAuth?
  // const token = req.cookies.session; // req is express
  // const user = User.verifyToken(token);
  // socket.request.user = user;

  return next();
});

io.on('connection', (socket) => {

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
    // chatAnnounce(socket.request.user.username + ' connected', io);
  }, 300);

  // display the Message of the Day
  const { motd, motdTitle, copyright } = require('./motd');
  const displayLogo = setTimeout(() => {
    socket.emit('game', motdTitle);
  }, 900);
  const displayCopyright = setTimeout(() => {
    socket.emit('game', copyright);
  }, 1300);
  const displayMOTD = setTimeout(() => {
    socket.emit('game', motd);
  }, 1600);

  socket.on('joinchat', () => {
    socket.join('chat', () => {
      chatAnnounce(socket.request.user.username + ' connected', io);
      socket.request.chat = true;
    });
  });

  // right col - The Chat Window
  socket.on('chat', (input) => {
    if(input.slice(0, 1) === '/') {
      commandParser(input, socket, 'chat', io)
        .then(res => {
          // handle emotes
          if(res.type === 'emote'){
            io.to('chat').emit('chat', {
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
                style: 'error'
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
        .catch(err => socket.emit('chat', err));
    } else {
      // standard chat response (to all)
      chatParser(input)
        .then(parsed => io.to('chat').emit('chat', {
          msg: socket.request.user.username + ': ' + parsed 
        }))
        .catch(err => socket.emit('chat', err));
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
      commandParser(input, socket, 'game', io)
        .then(res => {
          // announce username change
          if(res.announce) chatAnnounce(res.announce, io);
          return res;
        })
        .then(res => {
          socket.emit('game', res);
          if(res.currentRoom) socket.emit('game', {
            msg: res.currentRoom,
            html: true
          });
        })
        .catch(err => socket.emit('game', err));
    } else {
      socket.emit('game', { 
        msg: '> ' + input,
        color: 'burlywood'
      });
      gameParser(input, socket, io)
        .then(res => {
          socket.emit('game', res);
        })
        .catch(err => socket.emit('game', err));
    }
  });

  // clear timeout on disconnect
  socket.on('disconnect', () => {
    console.log(`${socket.request.user.username} disconnected`);
    if(socket.request.chat) chatAnnounce(socket.request.user.username + ' disconnected', io);
    clearTimeout(displayLogo);
    clearTimeout(displayMOTD);
    clearTimeout(displayCopyright);
    clearTimeout(connectedUser);
  });
});
