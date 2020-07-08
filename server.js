require('dotenv').config();
require('./lib/utils/connect')();
const mongoose = require('mongoose');

mongoose.connection.dropDatabase();

const library = require('./lib/rooms/library');
const horrorRoom = require('./lib/rooms/horror');
const fantasyRoom = require('./lib/rooms/fantasy');

Promise.resolve(library())
  .then(() => horrorRoom())
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
const { chatParser } = require('./lib/helpers/chatParser');
const { commandParser } = require('./lib/helpers/commandParser');

io.on('connection', (socket) => {
  // console.log(socket);
  console.log(`${socket.id} connected`);
  io.emit('chat', { msg: 'guest-' + socket.id.slice(0, 4) + ' connected' });

  // console.log(socket.id);

  const motdTitle = '  ooooo         o8o   .o8                                                o8o                  .   oooo <br />\
  `888\'         `"\'  "888                                                `"\'                .o8   `888 <br />\
   888         oooo   888oooo.  oooo d8b  .oooo.   oooo d8b oooo    ooo oooo  ooo. .oo.   .o888oo  888 .oo. <br />\
   888         `888   d88\' `88b `888""8P `P  )88b  `888""8P  `88.  .8\'  `888  `888P"Y88b    888    888P"Y88b <br />\
   888          888   888   888  888      .oP"888   888       `88..8\'    888   888   888    888    888   888 <br />\
   888       o  888   888   888  888     d8(  888   888        `888\'     888   888   888    888 .  888   888 <br />\
  o888ooooood8 o888o  `Y8bod8P\' d888b    `Y888""8o d888b        .8\'     o888o o888o o888o   "888" o888o o888o <br />\
                                                            .o..P\' <br />\
                                                            `Y8P\' <br />\
<br />\
                                 .oooooo..o             o8o <br />\
                                d8P\'    `Y8             `"\' <br />\
                                Y88bo.      oo.ooooo.  oooo  oooo d8b  .ooooo. <br />\
                                 `"Y8888o.   888\' `88b `888  `888""8P d88\' `88b <br />\
                                     `"Y88b  888   888  888   888     888ooo888 <br />\
                                oo     .d8P  888   888  888   888     888    .o <br />\
                                8""88888P\'   888bod8P\' o888o d888b    `Y8bod8P\' <br />\
                                             888 <br />\
                                            o888o';

  // display the Message of the Day
  const displayMOTD = setTimeout(() => {
    socket.emit('game', { msg: '<span style="font-size: 10px; color: blue; white-space: pre; font-family: monospace">' + motdTitle + '</span><br /><br /><span style="color:white">MOTD goes here.</span><hr /><br />', color: 'skyblue' });
  }, 2000);

  // emit message to all when receiving message from client
  socket.on('chat', (input) => {
    if(input.slice(0, 1) === '/') {
      commandParser(input)
        .then(res => {
          res.html = true;
          socket.emit('chat', res);
        })
        .catch(res => socket.emit('chat', res));
    } else {
      chatParser(input)
        .then(parsed => io.emit('chat', {
          msg: 'guest-' + socket.id.slice(0, 4) + ': ' + parsed 
        }))
        .catch(res => socket.emit('chat', res));
    }
  });

  socket.on('game', (input) => {
    if(input.slice(0, 1) === '/') {
      commandParser(input)
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
  

  // socket.on('game', () => {
  //   socket.emit('game', { msg: 'you are in a dark room. You are unable to move and can\'t see anything.' });
  // });

  // clear timeout on disconnect
  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`);
    clearTimeout(displayMOTD);
  });
});


// call the parser here
// parser(data)
//   .then(response => {
//     // parser promise.resolve()
//     switch(response.type){
//       case 'say':
//         io.emit('chat', { msg: 'Guest' + socket.id.slice(-3) + ': ' + response.message });
//         break;
//       case 'whisper':
//         io.to(response.toUser).emit('chat', { 
//           msg: 'from Guest' + socket.id.slice(-3) + ': ' + response.message,
//           color: 'red',
//           background: 'black'
//         });
//         break;
//       default:
//         io.emit('chat', { msg: 'Guest' + socket.id.slice(-3) + ': ' + response.message });
//     }
//   })
//   .catch(() => {
//     // parser promise.reject()
//     io.emit('chat', { msg: 'bad syntax' });
//   });
