const Room = require('../models/Room');
const User = require('../models/User');
const Item = require('../models/Item');

module.exports = async() => {

  const user = await User.create({
    username: 'user1',
    state: {
      horrorDoor: 'locked',
      foundRoderick: false,
      creatureDead: false,
      monsterDead: false,
      spaceship: 'locked',
      plant: 'whole',
      dome: 'intact'
    },
    password: '1234'
  });

  const libraryRoom = await Room.create({
    name: 'library',
    // user: user._id
    // description: 'this shows up for cool first interaction of room'
  });

  await User.findByIdAndUpdate(user._id, { currentLocation: libraryRoom.id }, { new: true });

  await Item.create({
    name: 'entrance',
    room: libraryRoom._id,
    interactions: {
      look: 'As you come to your senses you look around. You notice bookshelves. Endless bookshelves, you take in the scene and a voice brings you back to reality. A tall lanky figure ushers you closer.',
      take: 'There is nothing to take.',
      use: 'There is nothing to use the entrance for.'
    }
  });

  await Item.create({
    name: 'figure',
    room: libraryRoom._id,
    interactions: {
      look: 'A tall lanky figure greets you and offers their hand. They explain with no emotion that you have found yourself in the never ending Librarynth. The being explains there is endless reading material...but not all books are inviting.',
      take: 'The figure chuckles and shakes their head no.',
      use: 'The figure explains they barely know you.'
    }
  });

  await Item.create({
    name: 'bookshelf',
    room: libraryRoom._id,
    interactions: {
      look: 'As you approach the bookshelves you take in the countless number of books. You notice some of the titles seem to be spinning, no wait changing? Every time you try to look at a book the words change. This makes the books unreadable. You then hear a small whisper from your right. You notice some books you can read the title of. "Virus", "Siege", and "Interstellar".',
      take: 'The bookshelf is to large to take.',
      use: 'Maybe try taking a book from the bookshelf?'
    }
  });

  await Item.create({
    name: 'virus',
    room: libraryRoom._id,
    takeable: true,
    interactions: {
      look: 'You look at the large leather bound book. You tilt your head to read the title on the spine and it reads "Virus"',
      take: 'You grab the large leather bound book. The leather seems to creak when you pull it out of the shelf.',
      use: 'You open the book slowly and start to read the first sentence. "Your eyes catch sharp". Your eyes go wide as the book starts to suck you into the story!!! You suddenly find yourself in darkened, dusty room.  Your eyes catch sharp slivers of light cutting through what appears to be a window.  You notice it has been hastily boarded up at awkward angles, bent nail heads casting long, disfigured shadows against the sunlight as it makes its way through the cracks between the boards.  As your eyes continue to adjust to the light, you begin to make out shapes around you.  You notice an old wooden table across from the window.  It\'s still very dark, but you observe stuff strewn about it.  You can\'t discern what\'s there just yet.  Next to the table is a heavy wooden door.'
    }
  });

  await Item.create({
    name: 'interstellar',
    room: libraryRoom._id,
    takeable: true,
    interactions: {
      look: 'You look at the book and it gives you a strange, foreign feeling. You run your fingers over the impressions the title makes in the book cover. "Interstellar Alien," you say it out loud.  "Hmmm..."',
      take: 'You pick up the unusual book. You hold it a moment and hesitate.  Should you open it?',
      use: 'You open the book slowly and start to read the first sentence. "You are dizzy and you head is spinning so much it hurts...". You feel a tug on your body as book sucks you into the story!!! You open your eyes, regain your composure, and take in your surroundings.  You think to yourself \'What is this place?\' The light is blinding, and you feel an incredible intensity of heat. You move and notice an unfamiliar lightness in your body.  Each step is like a leap that lifts you high off the ground with effortless ease.  As you walk and bound up into the air, you can see out a little farther into the horizon.  You notice in the distance a small dome-like structure.  As you make your way toward it, other shapes take form.  There appears to be a ridge of rocky structures glittering in the light.  The rocks fascinate and mesmerize you.  You are almost hypnotized by their beauty.  You notice strange plant-like lifeforms dotted around the dome and the ridge.  You continue your approach as you feel something call you to the ridge.'
    }
  });

  await Item.create({
    name: 'siege',
    room: libraryRoom._id,
    takeable: true,
    interactions: {
      look: 'You take in the large bookcase and see a beautifully ordained book. You take a look at the spine and the title is "Siege".',
      take: 'You pull the book out of the case and notice it fills you with bravery.',
      use: 'You open the book slowly and hear trumpets and horns blowing in the distance. Your eyes go wide as the book starts to suck you into the story!!! You hear the horns blowing in the distance. You open your eyes and see your commander telling everyone to get ready and head to there posts. The creatures and monsters are coming. You take a deep breath and look around, you see the armory next to you and your commander waiting nearby.'
    }
  });
};
