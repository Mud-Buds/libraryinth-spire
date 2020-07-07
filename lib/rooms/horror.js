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

  await Room.create({
    name: 'library',
    user: user._id,
  });

  const horrorRoom = await Room.create({
    name: 'horror',
    user: user._id,
  });

  await User.findByIdAndUpdate(user._id, { currentLocation: horrorRoom.id }, { new: true });

  await Item.create({
    name: 'entrance',
    room: horrorRoom._id,
    interactions: {
      look: 'You suddenly find yourself in darkened, dusty room.  Your eyes catch sharp slivers of light cutting through what appears to be a window.  You notice it has been hastily boarded up at awkward angles, bent nail heads casting long, disfigured shadows against the sunlight as it makes its way through the cracks between the boards.  As your eyes continue to adjust to the light, you begin to make out shapes around you.  You notice an old wooden table across from the window.  It`s still very dark, but you observe stuff strewn about it.  You can`t discern what`s there just yet.  Next to the table is a heavy wooden door.',
      take: 'You can`t take the room!',
      use: 'You can`t use the room, you can only use items in the room.'
    }
  });

  await Item.create({
    name: 'table',
    room: horrorRoom._id,
    interactions: {
      look: 'You see the table in greater detail.  The items it holds aloft are in disarray.  You see dusty glass jars filled with strange fluids. There are weathered papers strewn about the table covered in scribbled sentences.  The words are difficult to make out without looking more closely.',
      take: 'The table is too heavy, you can`t take it.',
      use: 'You can`t use the table, you can only use items on the table.'
    }
  });

  await Item.create({
    name: 'papers',
    room: horrorRoom._id,
    takeable: false,
    interactions: {
      //How can we get the display of 'look' to present like it does here?  It's all slammed together as one big paragraph (and it includes the 'look papers' and 'look jars' commands)
      look: `You pick a page up and examine it.  You can make out dates and what appears to be logs of experiments.  You can't make out everything.  The author seemed to write aggressively, hurriedly, but there are a few passages that are legible enough to read:
        * Day 145: The blood samples coagulate and clot, the antidote doesn't appear to be working on infected samples.  The vaccine we're working on doesn't show signs of protection against the virus.  Infection rates rise daily, and the death count grows higher. The virus is seemingly unavoidable, like it's in the air.  With nowhere to bury them, bodies are being piled up along roadsides. Transmission of the virus shows no signs of stopping, but mysteriously the bodies are disappearing.  What's happening to them?  Where do they go?
        
        * Day 411: City officials all over the world are reporting citizens who have seen their loved ones walking the streets AFTER they've succumbed to virus and died.  It was just a few cases at first, and we brushed it off as incidents of extreme grief and cabin fever from isolation.  But the reports are piling up exponentially, and can't be ignored.  I've witnessed it myself.  Am I going crazy?  I hear things, I see things.  I don't want what's outside to get in.
      
      You are shaking, too afraid to read on.  You look over your shoulder at the boarded up window, your eyes widening.  You see the light outside the window shift and find yourself near panicking.  Is something out there?  You turn to put the paper back and notice a glint of light on brass.  It's a key.`,
      take: 'You have already read the paper, there is nothing else you can do with it.  You put it back.',
      use: 'You have already read the paper, there is nothing else you can do with it. You put it back.'
    }
  });

  await Item.create({
    name: 'jars',
    room: horrorRoom._id,
    takeable: false,
    interactions: {
      look: 'You pick up the jars one by one and blow the dust off.  You examine the contents, holding it close to your face and turning it, watching what`s inside move.  The fluids are viscous and dark, thick like molasses. You put them back.',
      take: 'The jar has nothing you can use.  You put it back.',
      use: 'You open one of the jars and smell it.  You recoil in disgust.  You immediately put it back.'
    }
  });

  await Item.create({
    name: 'door',
    room: horrorRoom._id,
    takeable: false,
    state: 'locked',
    interactions: {
      look: 'You notice in a dark corner a rectangular shape.  It`s a heavy wooden door.  There is a chair tucked under the handle.  Your mind races-- what were they trying to keep out?  Your only options to leave are the window or the door.',
      take: 'You can`t take the door, it is affixed to the wall.',
      use: 'You weigh your options, and hesitantly move the chair out of the way.  You turn the handle and push all of your weight into the door, but it won`t budge. You try the handle again and can hear it clicking.  The door appears to be locked.',
      //Do we want the transition back into the library to be narrated here when they open the door?
      useunlocked: 'You open the door...'
      // sucessfuluse: 'It won\'t open -- you\'ll need something to unlock it.'
    }
  });

  await Item.create({
    name: 'key',
    // container: papers._id,
    room: horrorRoom._id,
    // useWith: door._id
    takeable: true,
    interactions: {
      look: 'You look closer at the key.  It is small and looks antique, the brass discolored in a patina of oxidation.  You wonder what it`s for.',
      take: 'You pick up the key and put it in your pocket.  It may come in handy later.',
      // use: 'You can`t use the key without taking it first.',
      inventorytake: 'You already have the key.',
      inventorylook: 'You think you hear a sound.  Your heart begins to pound and you frantically feel into your pocket for the key.  You take a deep breath of relief: It`s still there.',
      inventoryuse: 'What are you trying to unlock?',
      usetable: 'The key is not cumbersome.  You decide not to put it back.  It may come in handy later.',
      usedoor: 'You move towards the door and kind the key in your pocket.  You put it into the keyhole, and hesitate for a moment as you recall the chair. You decide to unlock the door.'
    }
  });

  await Item.create({
    name: 'window',
    room: horrorRoom._id,
    takeable: false,
    interactions: {
      look: 'You see a boarded up window.',
      take: 'The window is heavily boarded.  You can`t take the window',
      use: 'You try to pry the boards from the window, but they are fortified with too many nails.  You can only look out from the cracks of space between the boards, but the light is too bright to see clearly.'
    }
  });
};
