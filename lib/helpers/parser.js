const User = require('../models/User');

const Room = require('../models/Room');

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

  const currentRoom = await User.findById('5f03707642adc01c5c904d17')
    .then(res => res.currentLocation);
  await Room.lookUp(currentRoom, object, action);


  // console.log(currentRoom);

  // get current room
  // lookup room
  // room instance (action, object) - choose one to method - object? room.object(action)

  //room.lookup(currentRoom, action, object);

  // look book

  const response = {
    msg: 'you look at the book',
    color: 'yellow'
  };

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
