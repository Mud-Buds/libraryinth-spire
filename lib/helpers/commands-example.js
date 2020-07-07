const verbTriggers((word) => {
  if {[
  {
    "look": ["examine", "inspect", "search"]
  },
  {
    "use": ["try", "put", "open", "lock", "unlock", "pick up"]
  },
  {
    "take": ["get", "grab", "acquire", "remove", "pick up"]
  },
  {
    "break": ["destroy", "crush"]
  },
  {
    "move": ["push", "pull", "turn", "throw"]
  },
  {
    "walk": console.log('Do you mean look? You are close enough to interact.')
  },
  {
    "status": console.log(player.status)
  },
  {
    "help": console.log('Try look, use, take, break, move, or status')
  }
]
  } else {
   console.log(error) {
     error: "I don't understand this command."
   })};