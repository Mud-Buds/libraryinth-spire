const User = require('../models/User');
const Room = require('../models/Room');
const Item = require('../models/Item');

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

const commandParser = async(input, socket, room) => {
  console.log('command: ' + input);

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

  // only parse chat commands here
  if(room === 'chat'){
    switch(command){
      case '/w':
      case '/whisper':
        // eslint-disable-next-line no-case-declarations
        const otheruser = await User.findOne({ username: parsed[1] });
        // console.log(otheruser);
        if(!otheruser) {
          error = { 
            msg: 'Could not find user ' + parsed[1],
            color: 'lightcoral'
          };
        } else if(!parsed[2]) {
          error = { 
            msg: 'You need to enter a message',
            color: 'lightcoral'
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
      case '/e':
      case '/em':
      case '/me':
        if(!parsed[1]){
          error = { 
            msg: 'You need to enter a message',
            color: 'lightcoral'
          };
        } else {
          response = {
            msg: parsed.slice(1).join(' '),
            color: '#b1a432',
            type: 'emote'
          };
        }
        break;
    }
  }

  // allow login/signup from either window (game/chat)
  switch(command){
    case '/signup':
      console.log(command);
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
          socket.emit('game', {
            msg: entrance.interactions.get('look')
          });
          response = {
            msg: 'signup success',
            color: 'forestgreen'
          };
          res.socket = socket.id;
          res.save();
          announce = socket.request.user.username + ' has signed up as ' + res.username;
          socket.request.user = res;
          // can be used to save token on front end with socket.on('authenticated', ...)
          socket.emit('authenticated', res.authToken());
        })
        .catch((err) => {
          console.log(Object.entries(err));
          switch(err.code){
            case 11000:
              error = {
                msg: 'Error: User already exists. If you are trying to log in, use /login <username> <password>',
                color: 'lightcoral'
              };
              break;
            case undefined:
              error = {
                msg: 'Error: undefined. Usage: /signup <username> <password>',
                color: 'lightcoral'
              };
              break;
            default:
              error = {
                msg: 'Error ' + err.code + ': ' + err.name + '. Usage: /signup <username> <password>',
                color: 'lightcoral'
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
          socket.emit('game', {
            msg: entrance.interactions.get('look')
          });
          response = {
            msg: 'login success',
            color: 'forestgreen'
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
                color: 'lightcoral'
              };
              break;
            default:
              error = {
                msg: 'Invalid Login Information. Usage: /login <username> <password>',
                color: 'lightcoral'
              };
          }
        });
      break;
    case '/w':
    case '/whisper':
      // eslint-disable-next-line no-case-declarations
      const otheruser = await User.findOne({ username: parsed[1] });
      // console.log(otheruser);
      if(!otheruser) {
        error = { 
          msg: 'Could not find user ' + parsed[1],
          color: 'lightcoral'
        };
      } else if(!parsed[2]) {
        error = { 
          msg: 'You need to enter a message',
          color: 'lightcoral'
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
    case '/e':
    case '/em':
    case '/me':
      if(!parsed[1]){
        error = { 
          msg: 'You need to enter a message',
          color: 'lightcoral'
        };
      } else {
        response = {
          msg: parsed.slice(1).join(' '),
          color: '#b1a432',
          type: 'emote'
        };
      }
      break;
    default:
      return Promise.reject({
        msg: 'Unknown Command.',
        color: 'lightcoral'
      });
  }

  // add announce to response object if announce was set (successful login/signup)
  if(announce) response.announce = announce;

  if(error) {
    console.log('commandError: ', error);
    return Promise.reject({
      ...error
    });
  } else {
    console.log('commandResponse: ', response);
    return Promise.resolve({ 
      ...response
    });
  }
};

module.exports = {
  commandParser
};
