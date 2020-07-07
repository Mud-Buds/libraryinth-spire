const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true,
    unique: true
  },

  locationCompleted: {
    horror: false
  },

  currentLocation: {
    type: mongoose.Schema.Types.ObjectId
  },

  inventory: [mongoose.Schema.Types.ObjectId],

  events: [mongoose.Schema.Types.ObjectId],

  state: {
    type: Map,
    of: String
  }

});

module.exports = mongoose.model('User', userSchema);
