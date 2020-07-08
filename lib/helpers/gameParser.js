const User = require('../models/User');
const Room = require('../models/Room');
const Item = require('../models/Item');

const tagInput = require('../lang-processing/tagInput');

const gameParser = async(input) => {
  const { action, object, target, error } = tagInput(input);

  // example error
  // if(error) return Promise.reject({
  //   msg: error,
  //   color: 'red'
  // });
  
  // fix this later - get current user
  const user = await User.findOne();

  let response;

  // whitelist actions
  switch(action) {
    case 'use': {
      response = useFunc(user, object, action, target);
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
      Promise.reject({ msg: error, color: 'red' });
    }
  }

  return Promise.resolve(response);
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
      .then(res => res.map(child => child.interactions.get('childlook')));
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
  if(item.takeable && !user.inventory.includes(item._id)) {
    user.inventory.push(item._id);
    await user.save();
  }

  return {
    msg: message ? message : item.interactions.get(action)
  };
};

// use key door
const useFunc = async(user, obj, action, target) => {
  //get item in current room
  const room = await Room.findById(user.currentLocation); 
  const item = await Item.findOne({ room: user.currentLocation, name: obj });
  const targetItem = await Item.findOne({ room: user.currentLocation, name: target });
  const library = await Room.findOne({ name: 'library' });
  const horrorRoom = await Room.findOne({ name: 'horror' });
  // let introMessage;
  //state
  //condition
  
  if(obj === 'key' && target === 'door') {
    if(user.state.get('horrorDoor') === 'locked') {
      user.state.set('horrorDoor', 'unlocked');
      await user.save();
    }
  }
  
  let message;
  if(room.name === 'horror' && obj === 'door') {
    if(user.state.get('horrorDoor') === 'unlocked') {
      message = item.interactions.get('useunlocked');
      await User.findByIdAndUpdate(user._id, { currentLocation: library._id }, { new: true });
      return { msg: message };
    }
  }

  if(obj === 'book') {
    message = item.interactions.get('use');
    await User.findByIdAndUpdate(user._id, { currentLocation: horrorRoom._id }, { new: true });
    // const entrance = await item.findOne({ room: user.currentLocation, name: 'entrance' });
    // introMessage = entrance.interactions.get('look');
    return { msg: message };
  }

  if(user.inventory.includes(item._id)) {
    message = item.interactions.get('use' + target) ? item.interactions.get('use' + target) : 'You cannot use that item like that!';
    // action...
    if(!target) message = item.interactions.get('inventory' + action);
  } else {
    message = item.interactions.get('use') ? item.interactions.get('use') : 'Use what?';
  }

  return {
    msg: message ? message : item.interactions.get(action)
  };
};

module.exports = {
  gameParser
};
