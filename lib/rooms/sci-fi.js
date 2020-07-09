const Room = require('../models/Room');
const User = require('../models/User');
const Item = require('../models/Item');

module.exports = async() => {

  // const user = await User.findOne();

  const sciFiRoom = await Room.create({
    name: 'sci-fi',
    // user: user._id
  });

  await Item.create({
    name: 'entrance',
    room: sciFiRoom._id,
    interactions: {
      look: 'You are dizzy and your head is spinning so much it hurts.  You open your eyes, regain your composure, and take in your surroundings.  You think to yourself \'What is this place?\' The light is blinding, and you feel an incredible intensity of heat. You move and notice an unfamiliar lightness in your body.  Each step is like a leap that lifts you high off the ground with effortless ease.  As you walk and bound up into the air, you can see out a little farther into the horizon.  You notice in the distance a small dome-like structure.  As you make your way toward it, other shapes take form.  There appears to be a ridge of rocky structures glittering in the light.  The rocks fascinate and mesmerize you.  You are almost hypnotized by their beauty.  You notice strange plant-like lifeforms dotted around the dome and the ridge.  You continue your approach as you feel something call you to the ridge.',
      take: 'You can\'t take the planet!',
      use: 'You can\'t use the planet.  Try using items you can see.',
    }
  });

  await Item.create({
    name: 'ridge',
    room: sciFiRoom._id,
    interactions: {
      look: 'You take a closer look at the ridge.  The glittering draws you near and you crouch down to inspect the minerals in the rocks.  Each sparkle is luminescent and shines with the power of every color in the rainbow.  There are rocks of all shapes and sizes that have weathered from the ridge over time.  As you rise, a small creature darts out with great speed, so fast that you can\'t make out its form.  After it tumbles a rock about the size of your palm.  In the low gravity, its descent to your feet is almost floating and dreamlike.',
      take: 'You can\'t take the whole ridge, but maybe you can take a rock.',
      use: 'You can\'t use the ridge, but maybe you can use a rock.'
    }
  });

  await Item.create({
    name: 'rock',
    room: sciFiRoom._id,
    takeable: true,
    interactions: {
      look: 'You look closer at the rock.  Time seems to stand still as you examine it more closely.  Its jagged edges and bright sparkle call to you.  Should you take it?',
      take: 'You reach down toward your feet and pick up the rock.  Against your expectations, the rock is textured, but soft in touch.  You put the rock in your pocket.  It might come in handy later.',
      use: 'What do you want to use the rock on?',
      inventorytake: 'You already have the rock.',
      inventoryuse: 'What are you trying to smash?',
      inventorylook: 'You check your pocket for the rock.  It\'s still there.',
      useplant: 'You smash the plants up with the rock into a paste.  What should you do with it now?',
      usedome: 'You take the rock and use it to smash the glass-like exterior of the dome until you create an opening that is large enough.  The sound it makes is deafeningly loud, but again it seems to come from inside your head.  You pull your hands up to cover your ears.  Your body shrinks in pain from the noise.  As you look up, you notice movement a little further away.  The creature you see is much larger than the last one.  "Is that an alien?!" you wonder aloud.  You hurry inside and are overcome with wonder.  There is a large spaceship, much larger than the dome itself.  "How does it fit in here?" you wonder.'
    }
  });

  await Item.create({
    name: 'plant',
    room: sciFiRoom._id,
    interactions: {
      look: 'You reach out to touch one of the bright blue leaves of a plant and snap your hand back, holding it with your other hand against your chest.  You\'re confused. Their leaves are both velvety and sharp to the touch.  You continue looking around.',
      take: 'You can\'t take any of the plants, they hurt too much to touch.  Your hand is still stinging and is starting to swell.  You may need something to smash and grind up the plant into a medicine.',
      use: 'You apply the paste to your hand, and immediately the swelling goes down and the stinging subsides.  You feel much better.',
      usedome: 'You smear the plant paste on the dome.  It does nothing.'
    }
  });

  await Item.create({
    name: 'dome',
    room: sciFiRoom._id,
    interactions: {
      look: 'You take a closer look at the dome.  It\'s made of a glass-like material, almost crystalline, that has its own luminescence, like light is coming from inside the glass itself.  It casts a curious and eerie glow.  Inside you can make out something indefinable.  It\'s difficult to wrap your mind around, because you can see through the dome to the other side, but can\'t clearly make out anything inside of it.  "What\'s in there?" you think to yourself.  You walk around the structure.  It appears small and large at the same time.  There doesn\'t appear to be a way inside.  You knock on the dome and hear a clink, but the sound seems to come from inside you.',
      take: 'You can\'t take the dome, it\'s too large.  Can you use something to find a way inside?',
      use: 'What do you want to use on the dome?'
    }
  });

  await Item.create({
    name: 'alien',
    room: sciFiRoom._id,
    interactions: {
      look: 'You see a creature in the distance.  Its body is almost human-like, but something is off about it-- different.  Even from the distance, you can see that it is very tall and thin.  It casts a long, linear shadow and you can see that it\'s moving right toward you.  You feel a sense of urgency.  You know you need to get out of there, and fast!',
      take: 'You can\'t take the alien, but can the alien take you?  You could try talking to them.',
      use: 'You can\'t use the alien, but maybe you can talk to them.',
      talk: 'The alien speaks to you telepathically.'
    }
  });

  await Item.create({
    name: 'key',
    room: sciFiRoom._id,
    takeable: true,
    interactions: {
      look: 'You look at the key.  It is strange and large, and star-shaped.',
      take: 'You take the key, gripping it tight with fear.  Now you just need to use it.',
      use: 'Where do you want to use the key?',
      inventorytake: 'You already have the key.',
      inventoryuse: 'What are you trying to use the key with?',
      inventorylook: 'The key is light in your pocket.  You reach your hand down to feel for it.  It\'s still there.',
      useplant: 'You can\'t use the key on the plant.',
      usedome: 'The dome is made of a glass-like material.  You can tell there\'s something inside, but it appears to have no door.  Do you have something else that you can use?',
      usespaceship: 'test'
    }
  });

  await Item.create({
    name: 'spaceship',
    room: sciFiRoom._id,
    interactions: {
      look: 'You look up at the ship.  It\'s imposingly large and as you move around it, it moves with you like quicksilver.',
      take: 'You can\'t take the spaceship, it is much too large.  Perhaps you can get inside of it?',
      use: 'You try to open the door to ship, but it won\'t budge.  You pull with all your might, and even brace both of your feet against the ship below the door, but no matter how hard you pull, you can\'t get it to open.  You examine the keyhole in the door.  It has a strange shape to it, like a star.  You must find something shaped similarly to open it with, and fast.  The alien is getting closer every second.',
      useunlocked: 'You have unlocked the door and hold the handle.  You reluctantly pull the door open, and it rises like a hatch above you with hydraulic smoothness.  You sit in the ship\'s command seat and pull back a lever...  Suddenly you are back in libraryinth.  You have escaped The Interstellar Alien.'
    }
  });
};
