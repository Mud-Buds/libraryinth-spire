const User = require('../models/User');
const Room = require('../models/Room');
const Item = require('../models/Item');

const gameParser = async(input) => {
  const parsed = input.split(' ');

  'look table';

  // room {}
  //   [objects]
  //     [interactions]


  // action = parsed[0]
  // object = parsed[1]

  // potential language processing
  // response:

  // example error
  if(parsed.length < 2) return Promise.reject({
    msg: 'error',
    color: 'red'
  });

  const action = parsed[0]; //look
  const object = parsed[1]; //table

  // {currentRoom} = JSON.parse(JSON.stringify(await User.find(username)));

  const user = await User.findOne();
  const response = await Room.lookUpCommand(user, object, action);

  return Promise.resolve(response);
};

const chatParser = (input) => {
  console.log(input);
  return Promise.resolve(input);
};

module.exports = {
  chatParser,
  gameParser
};
