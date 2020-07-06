const mongoose = require('mongoose');

const rooms = new mongoose.Schema({

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

rooms.virtual('items', {
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

rooms.statics.execute = function(actionObj) {
  console.log(actionObj);

  if(actionObj.type === 'look') {
    console.log('You look at the window and see that it is boarded up.');

  } else {
    console.log('I don`t understand this command');
  }
};

//room.lookup(currentRoom, action, object)

rooms.statics.lookUpCommand = async function(id, obj, action) {
  //id, 'look', 'table'
  const item = await this.model('Item').findOne({ room: id, name: obj });
  const children = await this.model('Item').find({ container: item._id })
    .then(res => res.map(child => child.interactions.get('look')));
  return {
    msg: item.interactions.get('look') + children
  };
};

rooms.statics.initialize = function() {
  
};

module.exports = mongoose.model('Room', rooms);
