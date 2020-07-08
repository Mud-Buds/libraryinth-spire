const Room = require('../models/Room');

const User = require('../models/User');

const Item = require('../models/Item');

module.exports = async() => {

  const user = await User.findOne();

  const fantasyRoom = await Room.create({
    name: 'fantasy',
    user: user._id
  });

  const entrance = await Item.create({
    name: 'entrance',
    room: fantasyRoom._id,
    interactions: {
      look: 'You hear the horns blowing in the distance. You open your eyes and see your commander telling everyone to get ready and head to there posts. The creatures are coming. You take a deep breath and look around, you see the armory next to you and your commander waiting nearby.',
      take: 'You cant take the entrance room.',
      use: 'There is nothing to use In the entrance, try moving to the armory.',
      talk: 'You cant talk to the entrance.'
    }
  });

  const commander = await Item.create({
    name: 'commander',
    room: fantasyRoom._id,
    interactions: {
      look: 'You see your commander standing at the ready waiting for people to move to there positions.',
      take: 'Im not going with you!',
      use: 'Grab your gear and get going!',
      talk: 'Commander: "I need you to go find the beacon keeper. He has the key to the beacon tower, we have to get it lit if we hope for assistance! I believe hes leading troops at the wall. Good luck soldier."'
    }
  });

  const armory = await Item.create({
    name: 'armory',
    room: fantasyRoom._id,
    interactions: {
      look: 'You see a large armory with a sword and a shield for you to take.',
      take: 'You cant take the armory.',
      use: 'There is nothing to use in the armory',
    }
  });

  await Item.create({
    name: 'sword',
    container: armory._id,
    room: fantasyRoom._id,
    takeable: true,
    interactions: {
      look: 'You see a sword ready for use inside the armory.',
      take: 'You step into the armory and equip the sword.',
      use: 'What do you want to use the sword on?.',
      useGreenCreature: 'You raise your sword and shield and stab at the creature. Your blade strikes true and the creature groans as it hits the ground defeated. You see behind the creature a tower some way down the wall.',
      useRedCreature: 'You collide with the red creature and your sword rings as it attempts to parry your blows. You are too fast and your sword strikes true dropping the red creature to the ground. As the creature drops to the ground you see the beacon keeper in the clearing. His name is Roderick.'
    }
  });

  await Item.create({
    name: 'shield',
    container: armory._id,
    room: fantasyRoom._id,
    takeable: true,
    interactions: {
      look: 'You see a shield leaning on the wall inside the armory.',
      take: 'You step into the armory and equip the shield.',
      use: 'What do you want to use the shield on?',
      useGreenCreature: 'You raise your shield and block the green creatures large swing. Your arm aches from the impact but you are safe.',
      useRedCreature: 'The creature swarms you and tries stabbing you multiple times you block all of these blows with your sturdy shield.'
    }
  });

  const wall = await Item.create({
    name: 'wall',
    room: fantasyRoom._id,
    interactions: {
      look: 'You start to approach the wall and see a raging battle before you, your fellow soldiers are battling the creatures on the parapets and wall. The sound of metal crashing together mixed with battlecries fill your ears. You dont see the beacon keeper yet but there seems to be a green creature in your way!',
      take: 'You cant take the wall...',
      use: 'Try using your sword on the green creature',
      talk: 'The sound of screams and fighting fill your ears.'
    }
  });

  const greenCreature = await Item.create({
    //update parser so we can have spaces?
    name: 'greencreature',
    room: fantasyRoom._id,
    interactions: {
      look: 'The large green creature snarls and raises its curved blade at you!',
      take: 'The large green creature has nothing you can take.',
      use: 'What item are you trying to use on the green creature?',
      talk: 'Creature: "IM GOING TO EAT YOUR FLESH."'
    }
  });

  const tower = await Item.create({
    name: 'tower',
    room: fantasyRoom._id,
    interactions: {
      look: 'You reach the large tower and see it is full of soldiers shooting crossbows at the creatures climbing the ladders. Theres a break in the chaos and you see a captain of the tower standing nearby looking at you confused.',
      take: 'You cant take the tower.',
      use: 'You cant use the tower.',
      talk: 'You cant talk to the tower.'
    }
  });

  const captain = await Item.create({
    name: 'captain',
    room: fantasyRoom._id,
    interactions: {
      look: 'You see the captain of the tower as he takes in the scene. He commands some of his troops to reload there crossbows and get ready.',
      take: 'You cant take the captain, he has his duty.',
      use: 'You cant use the captain.',
      talk: 'Captain: "The beacon keeper was here, he left me in charge. He went to reinforce the gate, they are preparing to batter it down. Good luck!"'
    }
  });

  const gate = await Item.create({
    name: 'gate',
    room: fantasyRoom._id,
    interactions: {
      look: 'You approach the gate to the castle and hear yelling from soldiers to brace. The gigantic wooden gate shutters as something outside slams into it. There is a breach and red creatures flood into the courtyard. A red creature approaches you and snarls.',
      take: 'You cant take the gate.',
      use: 'You cant use the gate.',
      talk: 'There is too much chaos to talk right now.'
    }
  });

  const redCreature = await Item.create({
    //update parser so we can have spaces?
    name: 'redcreature',
    room: fantasyRoom._id,
    interactions: {
      look: 'The quick and agile red creature snarls and raises its serrated daggers at you!',
      take: 'The quick and agile red creature has nothing you can take.',
      use: 'What item are you trying to use on the red creature?',
      talk: 'The creature snarls and doesnt say anything.'
    }
  });

  const roderick = await Item.create({
    name: 'roderick',
    room: fantasyRoom._id,
    interactions: {
      look: 'You approach Roderick and see him panting, he looks at you a little confused and asks what you need.',
      take: 'You cant take Roderick.',
      use: 'You cant use Roderick.',
      talk: 'Roderick: "I dont have the energy to make it to the beacon tower. You will have to go. Take the key from me and light the beacon. Please hurry!"'
    }
  });

  const key = await Item.create({
    name: 'key',
    room: fantasyRoom._id,
    takeable: true,
    interactions: {
      look: 'You see a large key set with a large emblem of a shield on it.',
      take: 'You take the key and add it to your belt.',
      usedoor: 'You use the key on the beacon tower door. A large mechanism starts turning and the tower lights up the land blinding you. As your vision returns you see you are back in the Librarynth.',
      talk: 'You cant talk to the beacon tower.'
    }
  });

  const beaconTower = await Item.create({
    name: 'beacontower',
    room: fantasyRoom._id,
    interactions: {
      look: 'You see the large Beacon Tower. The top of the tower has a large crystal in it that apparently lights up if activated. At the base of the tower there is a key hole in a door.',
      take: 'You cant take the beacon tower.',
      use: 'You would have to use something on the beacon tower. Maybe a key?',
      talk: 'You cant talk to the beacon tower.',
    }
  });
};
