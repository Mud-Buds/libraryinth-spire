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

rooms.statics.lookUp = async function(id, obj, action) {
  //id, 'look', 'table'
  console.log('hey');
  const item = await this.model('Item').findOne();
  console.log(item);
  console.log('hey hey');
};

rooms.statics.initialize = function() {
  
};

module.exports = mongoose.model('Room', rooms);
