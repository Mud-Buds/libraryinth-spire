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
  
  const user = await User.findOne();

  let response;

  // {currentRoom} = JSON.parse(JSON.stringify(await User.find(username)));
  switch(action) {
    case 'use': {
      response = useFunc();
      break;
    }
    case 'take': {
      response = takeFunc(user, object, action);
      break;
    }
    case 'look': {
      response = lookFunc(user, object, action);
      break;
    }
    default: {
      Promise.reject({ msg: 'Command not recognized' });
    }
  }

  // const response = await Room.lookUpCommand(user, object, action);

  return Promise.resolve(response);
};

const chatParser = (input) => {
  console.log(input);
  return Promise.resolve(input);
};

const lookFunc = async(user, obj, action) => {
  const item = await Item.findOne({ room: user.currentLocation, name: obj });

  let message;

  if(user.inventory.includes(item._id)) {
    message = item.interactions.get('inventory' + action);
  }

  let children = '';

  if(action === 'look') {
    children = await Item.find({ container: item._id, _id: { $nin: user.inventory } })
      .then(res => res.map(child => child.interactions.get('look')));
  }

  return {
    msg: message ? message : item.interactions.get(action) + children
  };
};

const takeFunc = async(user, obj, action) => {
  const item = await Item.findOne({ room: user.currentLocation, name: obj });

  let message;

  if(user.inventory.includes(item._id)) {
    message = item.interactions.get('inventory' + action);
  }

  // stores given object to user's inventory, if not already present
  if(action === 'take' && item.takeable && !user.inventory.includes(item._id)) {
    user.inventory.push(item._id);
    await user.save();
  }

  return {
    msg: message ? message : item.interactions.get(action)
  };
};

module.exports = {
  chatParser,
  gameParser
};
