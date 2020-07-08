const Room = require('../models/Room');
const User = require('../models/User');
const Item = require('../models/Item');

module.exports = async() => {
  const user = await User.findOne();

  const sciFiRoom = await Room.create({
    name: 'sci-fi',
    user: user._id
  });

  //book name:

  await Item.create({
    name: 'entrance',
    room: sciFiRoom._id,
    interactions: {
      look: 'You are dizzy and your head is spinning so much it hurts.  You open your eyes, regain your composure, and take in your surroundings.  You think to yourself \'What is this place?\' You move and notice an unfamiliar lightness in your body.  Each step is like a leap that lifts you high off the ground with effortless ease.  As you walk and bound up into the air, you can see out a little farther into the horizon.  You notice in the distance a small dome-like structure' 
      
      // You reach out to touch one and snap your hand back, holding it with the other against your chest.  You`re confused. Their leaves are both velvety and sharp to the touch.  You continue looking around.'
    }
  });
};
