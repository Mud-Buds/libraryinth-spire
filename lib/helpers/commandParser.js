const User = require('../models/User');
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

const commandParser = async(input, socket) => {
  console.log('command: ' + input);

  const parsed = input.split(' ');

  // example error
  // if(parsed.length < 2) return Promise.reject({
  //   msg: 'error',
  //   color: 'red'
  // });

  const command = parsed[0]; // /login

  let response;
  switch(command){
    case '/signup':
      // console.log('i got here');
      await User
        .create({
          username: parsed[1], 
          password: parsed[2]
        })
        .then(res => {
          response = 'signup success';
          socket.request.user = res;
          res.socket = socket.id;
          res.save();
        })
        .catch((err) => {
          console.log(Object.entries(err));
          switch(err.code){
            case 11000:
              response = 'Error: User already exists. If you are trying to log in, use /login <username> <password>';
              break;
            case undefined:
              response = 'Error: undefined. Usage: /signup <username> <password>';
              break;
            default:
              response = 'Error ' + err.code + ': ' + err.name + '. Usage: /signup <username> <password>';
          }
          return Promise.reject({
            msg: response,
            color: 'lightcoral'
          });
        });
      break;
    case '/login':
      await User
        .authorize(parsed[1], parsed[2])
        .then(res => {
          response = 'login success';
          socket.request.user = res;
          res.socket = socket.id;
          res.save();
        })
        .catch((err) => {
          switch(String(err)){
            case undefined:
              response = 'Error: undefined. Usage: /login <username> <password>';
              break;
            default:
              response = 'Invalid Login Information. Usage: /login <username> <password>';
          }
          return Promise.reject({
            msg: response,
            color: 'lightcoral'
          });
        });
      break;
    case '/w':
    case '/whisper':
      // eslint-disable-next-line no-case-declarations
      const otheruser = await User.find({ username: parsed[1] });
      if(!otheruser) {
        return Promise.reject({ 
          msg: 'Could not find user ' + parsed[1],
          color: 'lightcoral'
        });
      } else if(!parsed[2]) {
        return Promise.reject({ 
          msg: 'You need to enter a message',
          color: 'lightcoral'
        });
      } else {
        Promise.resolve({
          response: parsed.slice(2).join(' '),
          to: otheruser.socket,
          color: 'violet'
        });
      }
      break;
    default:
      return Promise.reject({
        msg: 'Unknown Command.',
        color: 'lightcoral'
      });
  }

  console.log(response);

  return Promise.resolve({ 
    msg: '> ' + response,
    color: 'grey'
  });
};

module.exports = {
  commandParser
};
