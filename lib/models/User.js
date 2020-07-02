const mongoose = require('mongoose');

const horrorItems = new mongoose.Schema({
  key: false,
  map: false,
  light: false
});

const horrorEvents = new mongoose.Schema({
  seenKey: false,
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

  inventory: [horrorItems],

  events: [horrorEvents]

});

module.exports = mongoose.model('User', users);
