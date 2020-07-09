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
  let currentRoom;

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
    }
  }

  // allow login/signup from either window (game/chat)
  switch(command){
    case '/signup':
      console.log(command);
      if(!parsed[1]) {
        error = {
          msg: 'Error: No username or password entered. Usage: /signup <username> <password>',
          style: 'error'
        };
        break;
      }
      if(!parsed[2]) {
        error = {
          msg: 'Error: No password entered. Usage: /signup <username> <password>',
          style: 'error'
        }
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
          // socket.emit('game', {
          //   msg: entrance.interactions.get('look')
          // });
          response = {
            msg: 'signup successful – username: <span style="color:lime">' + parsed[1] + '</span>, password: <span style="color:lime">' + parsed[2] + '</span>',
            style: 'success',
            html: true
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
                style: 'error'
              };
              break;
            case undefined:
              error = {
                msg: 'Error: undefined. Usage: /signup <username> <password>',
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
      switch(parsed[1]){
        case 'signup':
          response = {
            msg: '/signup &lt;username&gt; &lt;password&gt;<br /><br />\
            Sign up by typing this command in the box below with your username and password. You need to have an account to chat and play.<br /><br />',
            // <pre style="color:goldenrod; font-weight: bold;">    /signup <span style="color:lime">&lt;username&gt; &lt;password&gt;</span></pre>',
            style: 'help',
            html: true
          };
          break;
        case 'login':
          response = {
            msg: '/login &lt;username&gt; &lt;password&gt;<br /><br />\
            Log in by typing this command in the box below with your username and password. You need to be logged in to play.<br /><br />',
            style: 'help',
            html: true
          };
          break;
        case 'whisper':
          response = {
            msg: '/whisper &lt;username&gt; &lt;message&gt;<br /><br />\
            Chat Only. Use this command to send a private message to another user.<br /><br />\
            &nbsp;&nbsp;Aliases: /w, /t, /tell <br />\
            &nbsp;&nbsp;Example: /whisper Ryan Does this seem okay?<br /><br />',
            style: 'help',
            html: true
          };
          break;
        case 'emote':
          response = {
            msg: '/emote &lt;message&gt;<br /><br />\
            Chat Only. Allows you to show yourself taking an action in chat instead of sending a message.<br /><br />\
            &nbsp;&nbsp;Aliases: /m, /me, /e, /em <br />\
            &nbsp;&nbsp;Example: /me laughs at how ridiculous emotes are.<br /><br />',
            style: 'help',
            html: true
          };
          break;
        default:
          if(!parsed[1]) {
            response = {
              msg: '/help &lt;message&gt;<br /><br />\
              To interact with the game, try using actions like look, use, take, and talk. You can use /help <command> to see help info about that command. Help is available for the following commands:<br /><br />\
              &nbsp;&nbsp;signup<br />\
              &nbsp;&nbsp;login<br />\
              &nbsp;&nbsp;whisper<br />\
              &nbsp;&nbsp;emote<br /><br />',
              style: 'help',
              html: true
            };
          } else {
            error = {
              msg: 'No help entry found for <span style="color:lime">' + parsed[1] + '</span>',
              style: 'help',
              html: true
            };
          }
      }
  }

  // add announce to response object if announce was set (successful login/signup)
  if(announce) response.announce = announce;
  if(currentRoom) response.currentRoom = currentRoom;

  if(error) {
    console.log('commandError: ', error);
    return Promise.reject({
      ...error
    });
  } else if(response) {
    console.log('commandResponse: ', response);
    return Promise.resolve({ 
      ...response
    });
  } else { //default
    console.log('commandError: Unknown Command.');
    return Promise.reject({
      msg: 'Unknown Command.',
      style: 'error'
    });
  }
};

module.exports = {
  commandParser
};
