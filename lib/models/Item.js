const mongoose = require('mongoose');

const interactions = new mongoose.Schema({
  objectName: {
    type: String
  },
  
  use: {
    type: String
  },
  
  look: {
    type: String
  },

  take: {
    type: String
  }
});

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  container: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },

  interactions: {
    type: Map,
    of: String
  }
});

module.exports = mongoose.model('Item', itemSchema);
