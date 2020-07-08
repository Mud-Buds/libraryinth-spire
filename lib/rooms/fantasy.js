const Room = require('../models/Room');

const User = require('../models/User');

const Item = require('../models/Item');

module.exports = async() => {
  const user = await User.create({
    username: 'user1'
  });

  const fantasyRoom = await Room.create({
    name: 'fantasy',

    user: user._id
  });

  // const updatedLocation = await User.findByIdAndUpdate(user._id, { currentLocation: horrorRoom.id }, { new: true });

  const armory = await Item.create({
    name: 'armory',
      
    room: fantasyRoom._id,

    interactions: {
      look: 'You see a large armory full of equipment you can use to help defend the castle!'
    }
  });

  await Item.create({
    name: 'sword',
    container: armory._id,
    room: fantasyRoom._id,
    takeable: true,
    interactions: {
      look: 'You see a sword ready for use.',
      take: 'You equip the sword.',
      inventorytake: 'You already have the sword equipped',
      lookUser: 'The sword seems sharp and ready for use!'
    }
  });

  await Item.create({
    name: 'shield',
    container: armory._id,
    room: fantasyRoom._id,
    takeable: true,
    interactions: {
      look: 'You see a shield leaning on the wall.',
      take: 'You equip the shield.',
      inventorytake: 'You already have the shield equipped',
      lookUser: 'The shield is sturdy and ready to protect you from harm.'
    }
  });

  await Item.create({
    name: 'wall',
    room: fantasyRoom._id,
    interactions: {
      look: 'You overlook the wall and see that the defenders are holding them back.'
    }
  });
};
