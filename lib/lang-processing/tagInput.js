const lexicon = require('./lexicon');

module.exports = (input) => {
  // loop through input tokens, return array with data from lexicon
  const tokens = input.split(' ');
  
  // create new array of relevant lexical data objects
  const lexData = tokens
    .reduce((arr, token) => {
      const data = lexicon.filter(entry => {
        return entry.token === token.toLowerCase();
      })[0];

      // only relevant tokens are tagged and returned in the array
      if(data) arr.push(data);

      return arr;
    }, [])
    .map(token => {
      // any aliases for an action are then converted to that action, while retaining the object and target positions
      return token.aliasFor ? { token: token.aliasFor, tag: token.tag, objectPos: token.objectPos, targetPos: token.targetPos } : token;
    });

  // helper function to pull specific lexical data out of the array
  const getTokens = (tag) => {
    return lexData.filter(token => token.tag === tag);
  };
  
  // create object to feed into gameParser
  const parserObject = () => {
    const action = getTokens('ACT')[0];
    
    const items = getTokens('ITM');
  
    return {
      action: action.token,
      object: items[action.objectPos].token,
      target: items[action.targetPos].token
    };
  };
  
  console.log(parserObject());

  return parserObject();
};

