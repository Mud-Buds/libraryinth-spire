const Room = require('../models/Room');

const User = require('../models/User');

const Item = require('../models/Item');

module.exports = async() => {

  const user = await User.create({
    username: 'user1'
  });

  const horrorRoom = await Room.create({
    name: 'horror',

    user: user._id,
  });

  await User.findByIdAndUpdate(user._id, { currentLocation: horrorRoom.id }, { new: true });

  const table = await Item.create({
    name: 'table',
  
    room: horrorRoom._id,

    interactions: {
      look: 'It is a old wooden table.'
    }
  });

  await Item.create({
    name: 'door',

    room: horrorRoom._id,

    interactions: {
      look: 'It\'s a door. Great!',

      take: 'You can\'t take that!',

      use: 'You turn the handle, but it won\'t budge. You\'ll need something to unlock it.'

      // sucessfuluse: 'It won\'t open -- you\'ll need something to unlock it.'
    }
  });

  await Item.create({
    name: 'key',

    container: table._id,

    room: horrorRoom._id,
    
    // useWith: door._id
    
    takeable: true,

    interactions: {
      look: 'You see a key on the table.',

      take: 'You take the key.',

      inventorytake: 'You already have the key.',

      inventorylook: 'You examine the key and notice it looks like a car key.',

      use: 'What are you trying to unlock?',

      usetable: 'No point in putting it back now.',

      usedoor: 'You unlock the door.'
    }
  });

  await Item.create({
    name: 'window',

    room: horrorRoom._id,

    interactions: {
      look: 'You see a boarded up window.'
    }
  });

};
