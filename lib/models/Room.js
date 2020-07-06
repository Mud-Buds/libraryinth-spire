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

rooms.statics.execute = function(actionObj) {
  console.log(actionObj);

  if(actionObj.type === 'look') {
    console.log('You look at the window and see that it is boarded up.');

  } else {
    console.log('I don`t understand this command');
  }
};

rooms.statics.initialize = function() {
  
};

module.exports = mongoose.model('Room', rooms);
