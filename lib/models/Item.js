const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },

  container: {
    type: mongoose.Schema.Types.ObjectId,
  },

  interactions: {
    type: Map,
    of: String
  },

  takeable: {
    type: Boolean,
    default: false,
    required: true
  }
});

module.exports = mongoose.model('Item', itemSchema);
