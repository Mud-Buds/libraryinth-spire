backstory:


You have entered the library. 

-Welcome!  Take a look around the library.  Here you can communicate with other patrons. 
There are many books that catch your eye.  Pick them up and take a look:

//user picks up a book but doesn't understand the language.  It's interesting, but you move on.
*describe the book* 
But you can't read this language.  It just looks like gibbersih to you, so you put down the book.  Another book calls out to you.  You pick it up and your spidey senses kick in (or something).
//user picks up the book
*horror book* 
Suddenly the world around you spins.  You feel like you're losing your balance, and all colors swirl together.  You feel sick so you close your eyes.  When you open them, you are in another place and don't know how you got there.  The book falls at your feet as you examine the room.  

The first thing you notice is an old, rusty _car_. The doors have been removed and the seat's filling is spilling out from scratches and tears in the vinyl. 

A boarded up _window_
  //the user can *look* at the _window_

A dusty _desk_ filled with papers 
//user *looks* at _desk_
  -in the desk there's a _key_.  
  //user can *take* the _key_
    //if user *takes* key, add it to inventory

A locked _door_
//user can try to *use* the _door_ but it's locked
//user can try to *use* key on the _door_
  //the key doesn't work for the _door_

User can *look* at the old _car_
//user can try to *use* _car_
  //message: you can't start the _car_
//user can try to *use* key in _car_
  //this starts the _car_
  //user wins game (drive through _door_)

In server.js:
Adjust the displayMOTD chat message to specify that this is the chat where you can communicate with other players.

Include an intro message for the game in displayMOTD:

//socket.emit('game', { msg: 'Created by Erik Ford, Logan Scott, Melissa Smoot, and Rachel Donahue. Welcome to the <ASCII art displaying the name of the game> *Libraryinth*  You have entered a story where you can type commands to interact with the narrative.  Type 'look entrance' to get started.', color: 'green' })

