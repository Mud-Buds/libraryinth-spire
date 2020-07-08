 // example room?
{
    //game state win woncidtion maybe lose condition.
    "game": {
        "win-condition": {
            "source": "gamestate",
            "condition": {
                //uses key in car
            }
        }
    },
    "horror-location": { 
        //description of the room when they first enter the location.
         "description": {
          "default": "itsa me a room, ive got a table and a boarded window in me, theres a car but you dont have the key"  
         },
         "interactables": [
             {
                //this allows them to see the details of the interactable of the table.
                "id": "window",
                "name": "Boarded up Window",
                //They should be able to use type a command such as "look at table"
                "trigger": {
                    "action": "look",
                    "details": "As you approach the window you see it's been boarded up for some time. It wont keep them out for long"
                 }
             },
             {
                "id": "table",
                "name": "Old Table",
                "trigger": [
                    {
                    "action": "look",
                    "target": "table",
                    "details": "This old table is covered in trash and dust. You spot a set of car keys",
                    "effect": {
                        "hasSeen": "seenKey"
                    }
                    },
                    {
                    "action": "take",
                    "target": "key",
                    "details": "You take the key and add it to your inventory",
                    "effect": {
                        "addStatus": "hasKey"
                    }
                    }
                ]
             },
             {
                 "id": "car",
                 "name": "Cool Subaru",
                 "trigger": [
                     {
                         "action": "look",
                         "target": "car",
                         "details": "you see a cool subaru."
                     },
                     {
                         "action": "use",
                         "object": "key",
                         "target": "car",
                         "details": "You start the car wow",
                         "effect": {
                             "addStatus": "win"
                         }
                     }
                 ]
             }
         ]
    }
}