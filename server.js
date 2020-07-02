require('dotenv').config();
require('./lib/utils/connect')();

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

io.on('connection', (socket) => {
  // console.log(socket);
  console.log(`${socket.id} connected`);
  // console.log(socket.id);


  // socket.join(socket.id);
  
  // display the Message of the Day
  const displayMOTD = setTimeout(() => {
    socket.emit('chat', { msg: 'Welcome to the Libraryinth Spire!', color: 'blue' });
  }, 3000);

  // emit message to all when receiving message from client
  socket.on('chat', (input) => {
    io.emit('chat', { msg: socket.id.slice(-3) + ': ' + input });


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
  });

  // clear timeout on disconnect
  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`);
    clearTimeout(displayMOTD);
  });
});
