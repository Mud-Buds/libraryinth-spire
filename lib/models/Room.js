const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    enum: ['horror', 'library', 'fantasy']
  },
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

}, {
  toJSON: {
    virtuals: true,
  },

  toObject: {
    virtuals: true
  }
});

roomSchema.virtual('items', {
  ref: 'Item',
  localField: '_id',
  foreignField: 'room'
});

// rooms.statics.execute = function(actionObj) {
//   console.log(actionObj);

//   if(actionObj.type === 'look') {
//     console.log('You look at the window and see that it is boarded up.');

//   } else {
//     console.log('I don`t understand this command');
//   }
// };

roomSchema.statics.execute = function(actionObj) {
  console.log(actionObj);

  if(actionObj.type === 'look') {
    console.log('You look at the window and see that it is boarded up.');

  } else {
    console.log('I don`t understand this command');
  }
};

//room.lookup(currentRoom, action, object)

roomSchema.statics.lookUpCommand = async function(user, obj, action) {
  /*
  // concept: run functions, expect return of string; set msg variable to return string, then send to socket.io
  
  let msg;

  switch(action) {
    case use: {
      msg = useFunc();
      break;
    }
    case take: {
      msg = takeFunc();
      break;
    }
    case look: {
      msg = lookFunc();
      break;
    }
    default: {
      msg = 'Command not recognized';
    }
  }

  return {
    msg: msg
  };
  */

  //id, 'look', 'table'
  const item = await this.model('Item').findOne({ room: user.currentLocation, name: obj });

  let message;

  if(user.inventory.includes(item._id)) {
    message = item.interactions.get('inventory' + action);
  }

  // stores given object to user's inventory, if not already present
  if(action === 'take' && item.takeable && !user.inventory.includes(item._id)) {
    user.inventory.push(item._id);
    await user.save();
  }

  let children = '';

  if(action === 'look') {
    children = await this.model('Item').find({ container: item._id, _id: { $nin: user.inventory } })
      .then(res => res.map(child => child.interactions.get('look')));
  }

  return {
    msg: message ? message : item.interactions.get(action) + children
  };
};

roomSchema.statics.initialize = function() {
  
};

module.exports = mongoose.model('Room', roomSchema);
