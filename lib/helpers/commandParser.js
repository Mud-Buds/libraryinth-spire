const User = require('../models/User');
const Room = require('../models/Room');
const Item = require('../models/Item');

const help = require('./help');

// no express here...
// const setCookie = (user, res) => {
//   res.cookie('session', user.authToken(), {
//     //session cookie
//     maxAge: 1000 * 60 * 60 * 24,
//     httpOnly: true
//   });
// };

// const loggedIn = (user) => {
//   localStorage.setItem('user', user);
// }

const commandParser = async(input, socket, room, io) => {
  // console.log('command: ' + input);

  const parsed = input.split(' ');

  // example error
  // if(parsed.length < 2) return Promise.reject({
  //   msg: 'error',
  //   color: 'red'
  // });

  const command = parsed[0]; // /login

  let response;
  let error;
  let announce;
  let currentRoom;
  let usernames = [];
  let foundSockets = [];
  let users;
  let findUser;


  // only parse chat commands here
  if(room === 'chat'){
    switch(command){
      case '/t':
      case '/tell':
      case '/w':
      case '/whisper':
        // eslint-disable-next-line no-case-declarations
        const otheruser = await User.findOne({ username: parsed[1] });
        // console.log(otheruser);
        if(!otheruser) {
          error = { 
            msg: 'Could not find user ' + parsed[1],
            style: 'error'
          };
        } else if(!parsed[2]) {
          error = { 
            msg: 'You need to enter a message',
            style: 'error'
          };
        } else {
          // console.log(parsed.slice(2).join(' '));
          response = {
            msg: parsed.slice(2).join(' '),
            toUser: otheruser.socket,
            color: 'violet',
            toUsername: otheruser.username
          };
        }
        break;
      case '/emote':
      case '/e':
      case '/m':
      case '/em':
      case '/me':
        if(!parsed[1]){
          error = { 
            msg: 'You need to enter a message',
            style: 'error'
          };
        } else {
          response = {
            msg: parsed.slice(1).join(' '),
            color: '#b1a432',
            type: 'emote'
          };
        }
        break;
      case '/who':
        await io.in('chat').clients(async(error, clients) => {
          if(error) throw error;
          users = clients;
        });
        // console.log(users);
        await User.find({ 
          socket: { 
            $in: users
          } 
        })
          .then(res => {
            res.map((user) => {
              usernames.push(user.username);
              foundSockets.push(user.socket);
            });

            users.map(client => {
              if(!foundSockets.includes(client)) usernames.push('guest-' + client.slice(0, 4));
            });
            response = {
              msg: usernames.join('<br />'),
              html: true,
              style: 'help'
            };
          });
        
        break;
    }
  }

  const libraryRoom = await Room.findOne({
    name: 'library',
  });

  if(room === 'game'){
    switch(command){
      case '/return':
        findUser = await User.findOne({ _id: socket.request.user._id }).then(res => res);
        if(!socket.request.user.currentLocation) {
          error = {
            msg: 'Error: You need to be signed in to use this command.',
            style: 'error'
          };
        } else if(String(findUser.currentLocation) === String(libraryRoom._id)){
          response = {
            msg: 'You are already in the Library!' 
          };
        } else {
          await User
            .findByIdAndUpdate(socket.request.user._id, {
              currentLocation: libraryRoom._id
            }, { new: true })
            .then(async(res) => {
              const entrance = await Item.findOne({
                name: 'entrance',
                room: res.currentLocation
              });
              currentRoom = await entrance.interactions.get('look');
              response = {
                msg: 'You feel the book closing as it ejects you back in to the Library.',
              };
            })
            .catch((err) => {
              switch(String(err)){
                default:
                  error = {
                    msg: 'Error: Could not return. You must be signed in to use this command.',
                    style: 'error'
                  };
              }
            });
        }
        break;
      // case '/i':
      // case '/inv':
      // case '/inventory':
      //   findUser = await User.findOne({ _id: socket.request.user._id })
      //     .then(async(res) => {
      //       await Item.find({ room: res.currentLocation, _id: {
      //         $in: res.inventory
      //       } })
      //         .then(res => {
      //           response = {
      //             msg: '<span style="color:white">Your inventory:</span><br /><br /> ' + res.map(item => '&nbsp;&nbsp;' + item.name).join('<br />') + '<br />',
      //             html: true,
      //             style: 'object'
      //           };
      //         });  
      //     })
      //     .catch((err) => {
      //       switch(String(err)){
      //         default:
      //           error = {
      //             msg: 'Error: Could not show inventory. You must be signed in to use this command.',
      //             style: 'error'
      //           };
      //       }
      //     });
      //   break;
    }
  }

  // allow login/signup from either window (game/chat)
  switch(command){
    case '/signup':
      if(!parsed[1]) {
        error = {
          msg: 'Error: No username or password entered. Usage: /signup <username> <password>',
          style: 'error'
        };
        break;
      }
      if(!parsed[2]) {
        error = {
          msg: 'Error: No password entered. Usage: /signup <username> <password>.',
          style: 'error'
        };
        break;
      }
      // console.log('i got here');
      await User
        .create({
          username: parsed[1], 
          password: parsed[2],
          state: {
            horrorDoor: 'locked',
            foundRoderick: false,
            creatureDead: false,
            monsterDead: false,
            spaceship: 'locked',
            plant: 'whole',
            dome: 'intact'
          },
        })
        .then(async(res) => {
          const libraryRoom = await Room.findOne({
            name: 'library',
          });
          await User.findByIdAndUpdate(res._id, { currentLocation: libraryRoom.id }, { new: true });
          const entrance = await Item.findOne({
            name: 'entrance',
            room: libraryRoom._id
          });
          currentRoom = await entrance.interactions.get('look');
          response = {
            msg: 'signup successful – username: <span style="color:lime">' + parsed[1] + '</span>, password: <span style="color:lime">' + parsed[2] + '</span>',
            style: 'success',
            html: true
          };
          res.socket = socket.id;
          res.save();

          announce = socket.request.user.username + ' has signed up as ' + res.username;

          socket.request.user = res;
          socket.request.user.currentLocation = libraryRoom._id;

          // can be used to save token on front end with socket.on('authenticated', ...)
          socket.emit('authenticated', res.authToken());
        })
        .catch((err) => {
          switch(err.code){
            case 11000:
              error = {
                msg: 'Error: User already exists. If you are trying to log in, use /login <username> <password>',
                style: 'error'
              };
              break;
            case undefined:
              error = {
                msg: 'Error: undefined. Usage: /signup <username> <password>.',
                style: 'error'
              };
              break;
            default:
              error = {
                msg: 'Error ' + err.code + ': ' + err.name + '. Usage: /signup <username> <password>',
                style: 'error'
              };
          }
        });
      break;
    case '/login':
      await User
        .authorize(parsed[1], parsed[2])
        .then(async(res) => {
          const entrance = await Item.findOne({
            name: 'entrance',
            room: res.currentLocation
          });
          currentRoom = await entrance.interactions.get('look');
          // socket.emit('game', {
          //   msg: entrance.interactions.get('look')
          // });
          response = {
            msg: 'logged in as <span style="color:lime">' + parsed[1] + '</span>',
            style: 'success',
            html: true
          };
          res.socket = socket.id;
          res.save();
          announce = socket.request.user.username + ' has logged in as ' + res.username;
          socket.request.user = res;
          // can be used to save token on front end with socket.on('authenticated', ...)
          socket.emit('authenticated', res.authToken());
        })
        .catch((err) => {
          switch(String(err)){
            case undefined:
              error = {
                msg: 'Error: undefined. Usage: /login <username> <password>',
                style: 'error'
              };
              break;
            default:
              error = {
                msg: 'Invalid Login Information. Usage: /login <username> <password>',
                style: 'error'
              };
          }
        });
      break;
    case '/help':
      await help(parsed[1], response, error)
        .then(res => {
          response = res.response;
          error = res.error;
        });
      break;
  }

  // add announce to response object if announce was set (successful login/signup)
  if(announce) response.announce = announce;
  if(currentRoom) response.currentRoom = currentRoom;
  
  if(error) {
    // console.log('commandError: ', error);
    return Promise.reject({
      ...error
    });
  } else if(response) {
    // console.log('commandResponse: ', response);
    return Promise.resolve({ 
      ...response
    });
  } else { //default
    // console.log('commandError: Unknown Command.');
    return Promise.reject({
      msg: 'Unknown Command.',
      style: 'error'
    });
  }
};

module.exports = {
  commandParser
};
