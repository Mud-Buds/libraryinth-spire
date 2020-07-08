const User = require('../models/User');
// const setCookie = (user, res) => {
//   res.cookie('session', user.authToken(), {
//     //session cookie
//     maxAge: 1000 * 60 * 60 * 24,
//     httpOnly: true
//   });
// };

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
    case '/login':
      // console.log('i got here');
      await User
        .authorize(parsed[1], parsed[2])
        .then(res => {
          response = 'login success';
          socket.request.user = res;
          res.socket = socket.id;
          res.save();
        })
        .catch(err => {
          // console.log(err);
          return Promise.reject({
            msg: 'Invalid Login Information.'
          });
        });
      break;
    default:
      break;
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
