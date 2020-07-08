const Room = require('../models/Room');
const User = require('../models/User');
const Item = require('../models/Item');

module.exports = async() => {
  const user = await User.findOne();

  const sciFiRoom = await Room.create({
    name: 'sci-fi',
    user: user._id
  });

  await User.findByIdAndUpdate(user._id, { currentLocation: sciFiRoom.id }, { new: true });

  await Item.create({
    name: 'entrance',
    room: sciFiRoom._id,
    interactions: {
      look: 'You are dizzy and your head is spinning so much it hurts.  You open your eyes, regain your composure, and take in your surroundings.  You think to yourself \'What is this place?\' The light is blinding, and you feel an incredible intensity of heat. You move and notice an unfamiliar lightness in your body.  Each step is like a leap that lifts you high off the ground with effortless ease.  As you walk and bound up into the air, you can see out a little farther into the horizon.  You notice in the distance a small dome-like structure.  As you make your way toward it, other shapes take form.  There appears to be a ridge of rocky structures glittering in the light.  The rocks fascinate and mesmerize you.  You are almost hypnotized by their beauty.  You notice strange plant-like lifeforms dotted around the the dome and the ridge.  You continue your approach.',
      take: 'You can`t take the planet!',
      use: 'You can`t use the planet.  Try using items you can see.',
    }
  });

  await Item.create({
    name: 'ridge',
    room: sciFiRoom._id,
    interactions: {
      look: 'You take a closer look at the ridge.  The glittering draws you near and you crouch down to inspect the minerals in the rocks.  Each sparkle is luminescent and shines with the power of every color in the rainbow.  There are rocks of all shapes and sizes that have weathered from the ridge over time.  As you rise, a small creature darts out with great speed, so fast that you can`t make out its form.  After it tumbles a rock about the size of your palm.  In the low gravity, its descent to your feet is almost floating and dreamlike.',
      take: 'You can`t take the whole ridge, but maybe you can take a rock.',
      use: 'You can`t use the ridge, but maybe you can use a rock.'
    }
  });

  await Item.create({
    name: 'rock',
    room: sciFiRoom._id,
    takeable: true,
    interactions: {
      look: 'You look closer at the rock.  Time seems to stand still as you examine it more closely.  Its jagged edges and bright sparkle call to you.  Should you take it?',
      take: 'You reach down toward your feet and pick up the rock.  Against your expectations, the rock is textured, but soft in touch.  You put the rock in your pocket.  It might come in handy later.',
      inventorytake: 'You already have the rock.',
      inventoryuse: 'What are you trying to smash?',
      inventorylook: 'You check your pocket for the rock.  It`s still there.',
      useplant: '',
      usedome: ''
    }
  });

  await Item.create({
    name: 'plant',
    room: sciFiRoom._id,
    interactions: {
      look: 'You reach out to touch one of the bright blue leaves of a plant and snap your hand back, holding it with your other hand against your chest.  You`re confused. Their leaves are both velvety and sharp to the touch.  You continue looking around.',
      take: 'You can`t take any of the plants, they hurt too much to touch.  Your hand is still stinging and is starting to swell.',
      use: 'You can`t use the plants.  You don`t know enough about them.  They are too dangerous.',
      inventoryuse: 'What are you trying to smash?',
    }
  });

  await Item.create({
    name: 'dome',
    room: sciFiRoom._id,
    interactions: {
      look: 'You ',
      take: 'You ',
      use: 'You ',
      inventoryuse: 'What are you trying to smash?',
    }
  });

  await Item.create({
    name: 'alien',
    room: sciFiRoom._id,
    interactions: {
      look: 'You ',
      take: 'You ',
      use: 'You ',
      talk: ''
    }
  });

  await Item.create({
    name: 'key',
    room: sciFiRoom._id,
    takeable: true,
    interactions: {
      look: 'You ',
      take: 'You ',
      inventorytake: 'You already have the key.',
      inventoryuse: 'What are you trying to use the key with?',
      inventorylook: 'The key is light in your pocket.  You reach your hand down to feel for it.  It`s still there.',
      useplant: 'You can`t use the key on the plant.',
      usedome: 'The dome is made of a glass-like material.  You can tell there`s something inside, but it appears to have no door.  Do you have something else that you can use?'
    }
  });

  await Item.create({
    name: 'spaceship',
    state: 'locked',
    room: sciFiRoom._id,
    interactions: {
      look: 'You ',
      take: 'You ',
      use: 'You '
    }
  });
};
