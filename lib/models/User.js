const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  },

  socket: String,

  passwordHash: {
    type: String,
    required: true,
  } }, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id,
      delete ret.passwordHash;
    }
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id,
      delete ret.passwordHash;
    }
  }
});

//if user currentLocation changes it sends the currentLocations entrance.interactions.look info.


userSchema.virtual('password').set(function(password) {
  this.passwordHash = bcrypt.hashSync(password, +process.env.SALT_ROUNDS || 8);
});

userSchema.statics.authorize = function(username, password) {
  return this.findOne({ username })
    .then(user => {
      if(!user) {
        throw new Error('Invalid Login Information');
      }
      if(!bcrypt.compareSync(password, user.passwordHash)) {
        throw new Error('Invalid Login Information');
      }
        
      return user;
    });
};

userSchema.statics.verifyToken = function(token) {
  const { sub } = jwt.verify(token, process.env.APP_SECRET);
  return this.hydrate(sub);
};

userSchema.methods.authToken = function() {
  return jwt.sign({ sub: this.toJSON() }, process.env.APP_SECRET, {
    expiresIn: '24h'
  });
};

module.exports = mongoose.model('User', userSchema);
