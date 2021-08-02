require('dotenv').config();
require('./lib/utils/connect')();
const mongoose = require('mongoose');

const User = require('./lib/models/User');
const Item = require('./lib/models/Item');

const library = require('./lib/rooms/library');
const horrorRoom = require('./lib/rooms/horror');
const sciFiRoom = require('./lib/rooms/sci-fi');
const fantasyRoom = require('./lib/rooms/fantasy');

const app = require('./lib/app');
const chatHandler = require('./lib/helpers/chat');

// client


const PORT = process.env.PORT || 7890;
const http = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Started on ${PORT}`);
});

// all this should go into its own file. keep the server.js code clean
const io = require('socket.io').listen(http);

const { gameParser } = require('./lib/helpers/gameParser');
const { chatParser, chatAnnounce } = require('./lib/helpers/chatParser');
const { commandParser } = require('./lib/helpers/commandParser');

io.on('connection', (socket) => {

  socket.request.user = {};
  socket.request.user.username = 'guest-' + socket.id.slice(0, 4);

  // can be used for auto login on connect if token is present
  let reconnectLocation;
  socket.on('authenticate', async(input) => {
    // no need to wrap this in an async function
    User
    .verifyToken(input)
    // no need for an async function and use meaningful names
    .then(user => User.findByIdAndUpdate(user._id, { socket: socket.id }, { new: true }))
    .then(user => {
      if(!user) throw Error('No user found');
      socket.request.user = res;
      // dont use setTimeouts like this. its creating a race condition.
      reconnectLocation = setTimeout(async() => {
        const entrance = await Item.findOne({
          name: 'entrance',
          room: res.currentLocation
        });
        const currentRoom = await entrance.interactions.get('look');
        socket.emit('game', {
          msg: currentRoom,
          html: true
        });
      }, 2000);
      socket.join('chat', () => {
        chatAnnounce(socket.request.user.username + ' connected', io);
        socket.request.chat = true;
      });
    })
    .catch(() => {
      // user not found... unauth? Message about user data reset?
    });
  });

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
      if(!socket.request.chat) {
        chatAnnounce(socket.request.user.username + ' connected', io);
        socket.request.chat = true;
      }
    });
  });

  // right col - The Chat Window
  // move logic to other files
  socket.on('chat', (input) => chatHandler(input, socket, io));

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
  socket.on('disconnect', (reason) => {
    console.log(`${socket.handshake.time}: ${socket.handshake.address} - ${socket.id} (${socket.request.user.username}) disconnected. Reason: ${reason}.`);
    if(socket.request.chat) chatAnnounce(socket.request.user.username + ' disconnected', io);
    clearTimeout(displayLogo);
    clearTimeout(displayMOTD);
    clearTimeout(displayCopyright);
    clearTimeout(connectedUser);
    clearTimeout(reconnectLocation);
  });
});
