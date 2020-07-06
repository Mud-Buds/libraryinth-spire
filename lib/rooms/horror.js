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
  
    container: horrorRoom._id,

    interactions: {
      look: 'You look at the table'
    }
  });

  await Item.create({
    name: 'key',

    container: table._id,

    interactions: {
      look: 'There is a key on the table',

      lookUser: 'You examine the key and notice it looks like a car key'
    }
  });

};
