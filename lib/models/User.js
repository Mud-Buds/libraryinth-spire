const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  username: {
    type: String,
    required: true,
    unique: true
  },

  locationCompleted: {
    horror: false,
    sciFi: false
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

//if user currentLocation changes it sends the currentLocations entrance.interactions.look info.

module.exports = mongoose.model('User', userSchema);
