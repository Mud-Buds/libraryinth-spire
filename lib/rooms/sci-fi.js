const Room = require('../models/Room');
const Item = require('../models/Item');

module.exports = async() => {

  const sciFiRoom = await Room.create({
    name: 'sci-fi',
  });

  await Item.create({
    name: 'entrance',
    room: sciFiRoom._id,
    interactions: {
      look: 'You are dizzy and your head is spinning so much it hurts.  You open your eyes, regain your composure, and take in your surroundings.  You think to yourself \'What is this place?\' The light is blinding, and you feel an incredible intensity of heat. You move and notice an unfamiliar lightness in your body.  Each step is like a leap that lifts you high off the ground with effortless ease.  You realize you are on another planet, but where?  As you walk and bound up into the air, you can see out a little farther into the horizon.  You notice in the distance a small dome-like structure.  As you make your way toward it, other shapes take form.  There appears to be a ridge of rocky structures glittering in the light.  The rocks fascinate and mesmerize you.  You are almost hypnotized by their beauty.  You notice strange <span class="object">plant</span>-like lifeforms dotted around the dome and the <span class="object">ridge</span>.  You continue your approach as you feel something call you to the <span class="object">ridge</span>.',
      take: 'You can\'t take the planet!',
      use: 'You can\'t use the planet.  Try using items you can see.',
    }
  });

  await Item.create({
    name: 'ridge',
    room: sciFiRoom._id,
    interactions: {
      look: 'You take a closer look at the <span class="object">ridge</span>.  The glittering draws you near and you crouch down to inspect the minerals in the <span class="object">rocks</span>.  Each sparkle is luminescent and shines with the power of every color in the rainbow.  There are <span class="object">rocks</span> of all shapes and sizes that have weathered from the <span class="object">ridge</span> over time.  As you rise, a small creature darts out with great speed, so fast that you can\'t make out its form, and hides in some nearby psychedelic-looking <span class="object">plants</span>.  You look around at the <span class="object">plants</span> and notice more of them near the <span class="object">dome</span>.  When the critter ran, a <span class="object">rock</span> about the size of your palm tumbled down from the <span class="object">ridge</span>.  In the low gravity, its descent to your feet is almost floating and dreamlike.  Should you look at it more closely?',
      take: 'You can\'t take the whole <span class="object">ridge</span>, but maybe you can take a <span class="object">rock</span>.',
      use: 'You can\'t use the <span class="object">ridge</span>, but maybe you can use a <span class="object">rock</span>.'
    }
  });

  await Item.create({
    name: 'rock',
    room: sciFiRoom._id,
    takeable: true,
    interactions: {
      look: 'You look closer at the <span class="object">rock</span>.  Time seems to stand still as you examine.  Its jagged edges and bright sparkle call to you.  Should you take it?',
      take: 'You reach down toward your feet and pick up the <span class="object">rock</span>.  Against your expectations, the <span class="object">rock</span> is textured, but soft in touch.  You put the <span class="object">rock</span> in your pocket.  It might come in handy later.',
      use: 'What do you want to use the <span class="object">rock</span> on?',
      inventorytake: 'You already have the <span class="object">rock</span>.',
      inventoryuse: 'What are you trying to smash?',
      inventorylook: 'You check your pocket for the <span class="object">rock</span>.  It\'s still there.',
      useplant: 'You smash the <span class="object">plants</span> up with the <span class="object">rock</span> into a <span class="object">plant</span> paste.  What should you do with it now?',
      usedome: 'You take the <span class="object">rock</span> and use it to smash the glass-like exterior of the <span class="object">dome</span> until you create an opening that is large enough.  The sound it makes is deafeningly loud, but again it seems to come from inside your head.  You pull your hands up to cover your ears.  Your body shrinks in pain from the noise.  As you look up, you notice movement a little further away.  The creature you see is much larger than the last one.  "Is that an <span class="object">alien</span>?!" you wonder aloud.  You hurry inside and are overcome with wonder.  There is a large <span class="object">spaceship</span>, much larger than the <span class="object">dome</span> itself.  "How does it fit in here?" you wonder.  As you look around, you notice the <span class="object">alien</span> is still approaching.  You begin to look around the <span class="object">dome</span> more hurriedly.',
      usealien: 'You give the beautiful <span class="object">rock</span> to the <span class="object">alien</span>, and in your mind you hear them thank you.  The <span class="object">alien</span> hands you a star-shaped key, like nothing you\'ve ever seen before.  You feel embarrassed for having been so afraid of this kind, gentle creature, and you turn back towards the <span class="object">spaceship</span>, almost reluctant to leave.  You feel the <span class="object">alien</span> is now your friend.'
    }
  });

  await Item.create({
    name: 'plant',
    room: sciFiRoom._id,
    interactions: {
      look: 'You reach out to touch one of the bright blue leaves of a <span class="object">plant</span> and snap your hand back, holding it with your other hand against your chest.  You\'re confused. Their leaves are both velvety and sharp to the touch.  You continue looking around.',
      take: 'You can\'t take any of the <span class="object">plants</span>, they hurt too much to touch.  Your hand is still stinging and is starting to swell.  You may need something to smash and grind up the <span class="object">plant</span> into a medicine.',
      use: 'You apply the <span class="object">plant</span> paste to your hand, and immediately the swelling goes down and the stinging subsides.  You feel much better.',
      usedome: 'You smear the<span class="object">plant</span> paste on the <span class="object">dome</span>.  It does nothing.'
    }
  });

  await Item.create({
    name: 'dome',
    room: sciFiRoom._id,
    interactions: {
      look: 'You take a closer look at the <span class="object">dome</span>.  It\'s made of a glass-like material, almost crystalline, that has its own luminescence, like light is coming from inside the glass itself.  It casts a curious and eerie glow.  Inside you can make out something indefinable.  It\'s difficult to wrap your mind around, because you can see through the dome to the other side, but can\'t clearly make out anything inside of it.  "What\'s in there?" you think to yourself.  You walk around the structure.  It appears small and large at the same time.  There doesn\'t appear to be a way inside.  You knock on the <span class="object">dome</span> and hear a clink, but the sound seems to come from inside you.',
      take: 'You can\'t take the <span class="object">dome</span>, it\'s too large.  Can you use something to find a way inside?',
      use: 'What do you want to use on the <span class="object">dome</span>?'
    }
  });

  await Item.create({
    name: 'alien',
    room: sciFiRoom._id,
    interactions: {
      look: 'You see a creature in the distance.  Its body is almost human-like, but something is off about it-- different.  Even from the distance, you can see that it is very tall and thin.  It casts a long, linear shadow and you can see that it\'s moving right toward you.  \'Is that an <span class="object">alien</span>?!\'You feel a sense of urgency as the <span class="object">alien</span> approaches you.',
      take: 'You can\'t take the <span class="object">alien</span>, but can the <span class="object">alien</span> take you?  You could try talking to them.',
      use: 'You can\'t use the <span class="object">alien</span>, but maybe you can talk to them.',
      talk: 'The <span class="object">alien</span> speaks to you telepathically and explains that they will give you the <span class="object">key</span>  to the <span class="object">spaceship</span> in return for the <span class="object">rock</span>.'
    }
  });

  await Item.create({
    name: 'key',
    room: sciFiRoom._id,
    takeable: true,
    interactions: {
      look: 'You look at the <span class="object">key</span>.  It is strange and large, and star-shaped.',
      take: 'You take the <span class="object">key</span>, gripping it tight with fear.  Now you just need to use it.',
      use: 'Where do you want to use the <span class="object">key</span>?',
      inventorytake: 'You already have the <span class="object">key</span>.',
      inventoryuse: 'What are you trying to use the <span class="object">key</span> with?',
      inventorylook: 'The <span class="object">key</span> is light in your pocket.  You reach your hand down to feel for it.  It\'s still there.',
      useplant: 'You can\'t use the <span class="object">key</span> on the <span class="object">plant</span>.',
      usedome: 'The <span class="object">dome</span> is made of a glass-like material.  You can tell there\'s something inside, but it appears to have no door.  Do you have something else that you can use?',
      usespaceship: 'You have unlocked the door and hold the handle.  You reluctantly pull the door open, and it rises like a hatch above you with hydraulic smoothness.'
    }
  });

  await Item.create({
    name: 'spaceship',
    room: sciFiRoom._id,
    interactions: {
      look: 'You look up at the <span class="object">spaceship</span>.  It\'s imposingly large and as you move around it, it moves with you like quicksilver.',
      take: 'You can\'t take the <span class="object">spaceship</span>, it is much too large.  Perhaps you can get inside of it?',
      use: 'You try to open the door to <span class="object">spaceship</span>, but it won\'t budge.  You pull with all your might, and even brace both of your feet against the ship below the door, but no matter how hard you pull, you can\'t get it to open.  You examine the keyhole in the door.  It has a strange shape to it, like a star.  You must find something shaped similarly to open it with, and fast.  The <span class="object">alien</span> is getting closer every second.',
      useunlocked: 'You settle into the <span class="object">spaceship</span> and hand the <span class="object">alien</span> the <span class="object">rock</span>.  You are sad to part with it, but happy to have access to the <span>spaceship</span>.  You wave to the <span class="object">alien</span> and they wish you safe travels as they set the <span class="object">spaceship\'s</span> navigation to Earth.  The <span class="object">dome</span> seems to disappear as the <span class="object">spaceship</span> rises above the planet. You look out with wonder and blink.  When you open your eyes, you find yourself back in the Libraryinth.'
    }
  });
};
