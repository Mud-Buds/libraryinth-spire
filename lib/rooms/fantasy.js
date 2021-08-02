const Room = require('../models/Room');
const Item = require('../models/Item');

module.exports = async() => {

  const fantasyRoom = await Room.create({
    name: 'fantasy'
  });

  await Item.create({
    name: 'entrance',
    room: fantasyRoom._id,
    interactions: {
      look: 'You hear horns blowing in the distance. You open your eyes and see your <span class="object">commander</span> telling everyone to get ready and head to their posts. The creatures and monsters are coming. You take a deep breath and look around, you see the <span class="object">armory</span> next to you and your <span class="object">commander</span> waiting nearby.',
      take: 'You cant take the entrance room.',
      use: 'There is nothing to use in the entrance, try moving to the armory.',
      talk: 'You can\'t talk to the entrance.'
    }
  });

  await Item.create({
    name: 'commander',
    room: fantasyRoom._id,
    interactions: {
      look: 'You see your <span class="object">commander</span> standing at the ready waiting for people to move to their positions.',
      take: 'I\'m not going with you!',
      use: 'Grab your gear and get going!',
      talk: '<span class="object">Commander</span>: "I need you to go find the beacon keeper. He has the object needed to light the beacon tower, we have to get it lit if we hope for assistance! I believe hes leading troops at the <span class="object">wall</span>. Good luck soldier."'
    }
  });

  const armory = await Item.create({
    name: 'armory',
    room: fantasyRoom._id,
    interactions: {
      look: 'You see a large <span class="object">armory</span> with a <span class="object">sword</span> and a <span class="object">shield</span> for you to take.',
      take: 'You can\'t take the armory.',
      use: 'There is nothing to use in the <span class="object">armory</span>',
    }
  });

  // create your items all at once
  await Item.create([
    {
      name: 'sword',
      container: armory._id,
      room: fantasyRoom._id,
      takeable: true,
      interactions: {
        look: 'You see a <span class="object"> sword </span> ready for use inside the <span class="object"> armory </span>.',
        take: 'You step into the <span class="object"> armory </span> and equip the <span class="object"> sword </span>.',
        use: 'What do you want to use the <span class="object"> sword </span> on?.',
        usecreature: 'You raise your <span class="object"> sword </span> and <span class="object"> shield </span> and stab at the <span class="object">creature</span>. Your blade strikes true and the <span class="object">creature</span> groans as it hits the ground defeated. You see behind the <span class="object">creature</span> a <span class="object">tower</span> some way down the wall.',
        usemonster: 'You collide with the <span class="object">monster</span> and your <span class="object">sword</span> rings as it attempts to parry your blows. You are too fast and your <span class="object">sword</span> strikes true dropping the <span class="object">monster</span> to the ground. As the monster drops to the ground you see the beacon keeper in the clearing. His name is <span class="object">Roderick</span>.'
      }
    },
    {
      name: 'shield',
      container: armory._id,
      room: fantasyRoom._id,
      takeable: true,
      interactions: {
        look: 'You see a <span class="object">shield</span> leaning on the wall inside the <span class="object">armory</span>.',
        take: 'You step into the <span class="object">armory</span> and equip the <span class="object">shield</span>.',
        use: 'What do you want to use the <span class="object">shield</span> on?',
        usecreature: 'You raise your <span class="object">shield</span> and block the <span class="object">creature\'s</span> large swing. Your arm aches from the impact but you are safe.',
        usemonster: 'The <span class="object">monster</span> swarms you and tries stabbing you multiple times, but you block all of these blows with your sturdy <span class="object">shield</span>.'
      }
    },
    {
      name: 'wall',
      room: fantasyRoom._id,
      interactions: {
        look: 'You start to approach the <span class="object">wall</span> and see a raging battle before you. Your fellow soldiers are battling the creatures on the parapets and <span class="object">wall</span>. The sound of metal crashing together mixed with battlecries fill your ears. You don\'t see the beacon keeper yet but there seems to be a <span class="object">creature</span> in your way!',
        take: 'You can\'t take the <span class="object">wall</span>...',
        use: 'Try using your <span class="object">sword</span> on the creature',
        talk: 'The sound of screams and fighting fill your ears.'
      }
    },
    {
      name: 'creature',
      room: fantasyRoom._id,
      interactions: {
        look: 'The large <span class="object">creature</span> snarls and raises its curved blade at you!',
        take: 'The large <span class="object">creature</span> has nothing you can take.',
        use: 'What object are you trying to use on the <span class="object">creature</span>?',
        talk: '<span class="object">Creature</span>: "I\'M GOING TO EAT YOUR FLESH!"'
      }
    },
    {
      name: 'tower',
      room: fantasyRoom._id,
      interactions: {
        look: 'You reach the large <span class="object">tower</span> and see it is full of soldiers shooting crossbows at the creatures climbing the ladders. There\'s a break in the chaos and you see a <span class="object">captain</span> of the <span class="object">tower</span> standing nearby looking at you confused.',
        take: 'You can\'t take the <span class="object">tower</span>.',
        use: 'You can\'t use the <span class="object">tower</span>.',
        talk: 'You can\'t talk to the <span class="object">tower</span>.'
      }
    },
    {
      name: 'captain',
      room: fantasyRoom._id,
      interactions: {
        look: 'You see the <span class="object">captain</span> of the <span class="object">tower</span> as he takes in the scene. He commands some of his troops to reload there crossbows and get ready.',
        take: 'You can\'t take the <span class="object">captain</span>, he has his duty.',
        use: 'You can\'t use the <span class="object">captain</span>.',
        talk: '<span class="object">Captain</span>: "The beacon keeper was here, he left me in charge. He went to reinforce the <span class="object">gate</span>, they are preparing to batter it down. Good luck!"'
      }
    },
    {
      name: 'gate',
      room: fantasyRoom._id,
      interactions: {
        look: 'You approach the <span class="object">gate</span> to the castle and hear yelling from soldiers to brace. The gigantic wooden <span class="object">gate</span> shudders as something outside slams into it. There is a breach and monsters flood into the courtyard. A <span class="object">monster</span> approaches you and snarls.',
        take: 'You can\'t take the <span class="object">gate</span>.',
        use: 'You can\'t use the <span class="object">gate</span>.',
        talk: 'There is too much chaos to talk right now.'
      }
    },
    {
      name: 'monster',
      room: fantasyRoom._id,
      interactions: {
        look: 'The quick and agile <span class="object">monster</span> snarls and raises its serrated daggers at you!',
        take: 'The quick and agile <span class="object">monster</span> has nothing you can take.',
        use: 'What object are you trying to use on the <span class="object">monster</span>?',
        talk: 'The <span class="object">monster</span> snarls and doesn\'t say anything.'
      }
    },
    {
      name: 'roderick',
      room: fantasyRoom._id,
      interactions: {
        look: 'You approach <span class="object">Roderick</span> and see him panting, he looks at you a little confused and asks what you need.',
        take: 'You can\'t take <span class="object">Roderick</span>.',
        use: 'You can\'t use <span class="object">Roderick</span>.',
        talk: '<span class="object">Roderick</span>: "I don\'t have the energy to make it to the beacon tower. You will have to go. Take the <span class="object">key</span> from me and light the <span class="object">beacon</span>. Please hurry!"'
      }
    },
    {
      name: 'key',
      room: fantasyRoom._id,
      takeable: true,
      interactions: {
        look: 'You see a large <span class="object">key</span> set with a large emblem of a shield on it.',
        take: 'You take the <span class="object">key</span> and add it to your belt.',
        usedoor: 'You use the <span class="object">key</span> on the <span class="object">beacon</span> <span class="object">door</span>. A large mechanism starts turning and the beacon lights up the land, blinding you. As your vision returns you see you are back in the Librarynth.',
        talk: 'You can\'t talk to the <span class="object">beacon</span>.'
      }
    },
    {
      name: 'beacon',
      room: fantasyRoom._id,
      interactions: {
        look: 'You see the large <span class="object">beacon</span>. The top of the tower has a large crystal in it that apparently lights up if activated. At the base of the beacon there is a <span class="object">key</span> hole in a <span class="object">door</span>.',
        take: 'You can\'t take the <span class="object">beacon</span>.',
        use: 'You would have to use something on the <span class="object">beacon</span>. Maybe a <span class="object">key</span>?',
        talk: 'You can\'t talk to the <span class="object">beacon</span>.',
      }
    }
  ]);
};
