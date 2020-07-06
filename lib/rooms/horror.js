const Room = require('../models/Room');

const User = require('../models/User');

const Object = require('../models/Object');

const user = User.create({
  username: 'user1'
});

const horrorRoom = Room.create({
  name: 'horror',

  user: user._id,
});

const updatedLocation = user.findByIdAndUpdate(user._id, { currentLocation: horrorRoom.id }, { new: true });

const table = Object.create({
  name: 'table',
  
  container: horrorRoom._id,

  interactions: {
    look: 'You look at the table'
  }
});

Object.create({
  name: 'key',

  container: table._id,

  interactions: {
    look: 'There is a key on the table',

    lookUser: 'You examine the key and notice it looks like a car key'
  }
});

