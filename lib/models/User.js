const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  type: mongoose.Schema.Types.ObjectId
});

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

  events: [eventSchema]

});

module.exports = mongoose.model('User', userSchema);
