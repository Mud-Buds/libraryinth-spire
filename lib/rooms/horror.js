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

  const updatedLocation = await User.findByIdAndUpdate(user._id, { currentLocation: horrorRoom.id }, { new: true });

  const table = await Item.create({
    name: 'table',
  
    room: horrorRoom._id,

    interactions: {
      look: 'It is a old wooden table.'
    }
  });

  await Item.create({
    name: 'key',

    container: table._id,

    room: horrorRoom._id,

    takeable: true,

    interactions: {
      look: 'You see a key on the table.',

      take: 'You take the key.',

      lookUser: 'You examine the key and notice it looks like a car key.'
    }
  });

  const window = await Item.create({
    name: 'window',

    room: horrorRoom._id,

    interactions: {
      look: 'You see a boarded up window.'
    }
  });

};
