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
  }

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
  //id, 'look', 'table'
  const item = await this.model('Item').findOne({ room: user.currentLocation, name: obj });

  if(action === 'take' && item.takeable && !user.inventory.includes(item._id)) {
    user.inventory.push(item._id);
    await user.save();
  }
  const inventory = user.inventory;
  const children = await this.model('Item').find({ container: item._id, _id: { $nin: inventory } })
    .then(res => res.map(child => child.interactions.get('look')));
    
  return {
    msg: item.interactions.get('look') + children
  };
};

roomSchema.statics.initialize = function() {
  
};

module.exports = mongoose.model('Room', roomSchema);
