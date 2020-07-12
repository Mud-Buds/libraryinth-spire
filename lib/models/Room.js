const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    enum: ['horror', 'library', 'fantasy', 'sci-fi'],
    unique: true
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

roomSchema.statics.execute = function(actionObj) {
  console.log(actionObj);

  if(actionObj.type === 'look') {
    console.log('You look at the window and see that it is boarded up.');

  } else {
    console.log('I don`t understand this command');
  }
};

roomSchema.statics.lookUpCommand = async function(user, obj, action) {
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

module.exports = mongoose.model('Room', roomSchema);
