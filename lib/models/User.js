const mongoose = require('mongoose');

const horrorEvents = new mongoose.Schema({
  seenKey: false,
  seenLight: false
});

const horrorInventory = new mongoose.Schema({
  hasKey: false,
  hasLight: false
});

const users = new mongoose.Schema({

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

  inventory: [horrorInventory],

  events: [horrorEvents]

});

module.exports = mongoose.model('User', users);
