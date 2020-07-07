const Room = require('../models/Room');
const User = require('../models/User');
const Item = require('../models/Item');

module.exports = async() => {

  const user = await User.create({
    username: 'user1',
    state: {
      horrorDoor: 'locked'
    }
  });

  const libraryRoom = await Room.create({
    name: 'library',
    user: user._id,
  });

  await User.findByIdAndUpdate(user._id, { currentLocation: libraryRoom.id }, { new: true });

  await Item.create({
    name: 'entrance',
    room: libraryRoom._id,
    interactions: {
      look: 'As you come to your senses you look around. You notice bookshelves. Endless bookshelves, you take in the scene and a voice brings you back to reality. A tall lanky figure ushers you closer.',
      take: 'There is nothing to take.'
    }
  });

  await Item.create({
    name: 'figure',
    room: libraryRoom._id,
    interactions: {
      look: 'A tall lanky figure greets you and offers their hand. They explain with no emotion that you have found yourself in the never ending Librarynth. The being explains there is endless reading material...but not all books are inviting.',
      take: 'The figure chuckles and shakes their head no.'
    }
  });

  const bookshelf = await Item.create({
    name: 'bookshelf',
    room: libraryRoom._id,
    interactions: {
      look: 'As you approach the bookshelves you take in the countless number of books. You notice some of the titles seem to be spinning, no wait changing? Every time you try to look at a book the words change. This makes the books unreadable. You then hear a small whisper from your right. You notice a book that you can read. You notice the books title. BOOK TITLE.',
      take: 'The bookshelf is to large to take.'
    }
  });

  const horrorBook = await Item.create({
    name: 'book',
    container: bookshelf._id,
    room: libraryRoom._id,
    takeable: true,
    interactions: {
      look: 'You look at the large leather bound book. You tilt your head to read the title on the spine and it reads BOOK TITLE.',
      take: 'You grab the large leather bound book. The leather seems to creak when you pull it out of the shelf.',
      use: 'You open the book slowly and start to read the first sentence. INSERT HORRORROOMS FIRST 3-4 WORDS. Your eyes go wide as the book starts to suck you into the story!'
    }
  });

};
