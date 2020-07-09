const lexicon = require('./lexicon');

module.exports = (input) => {
  // loop through input tokens, return array with data from lexicon
  const tokens = input.split(' ');
  // console.log(tokens);
  
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
      // any aliases for an action or item are then converted to that action, while retaining the object and target positions
      return token.aliasFor ? { token: token.aliasFor, tag: token.tag, objectPos: token.objectPos, targetPos: token.targetPos } : token;
    });

  // console.log(lexData);

  // helper function to pull specific lexical data out of the array
  const getTokens = (tag) => {
    return lexData.filter(token => token.tag === tag);
  };
  
  // create object to feed into gameParser
  const createOutput = () => {
    // if there's no data at all, return error
    if(!lexData[0]) return { error: 'invalid command' };

    const action = getTokens('ACT')[0];
    
    const items = getTokens('ITM');

    // if the user has submitted 'look' without specifying an object, treat as 'look entrance'
    if(action.token === 'look' && !items[0]) items.push({ token: 'entrance' });
    
    console.log(items);

    // otherwise, if no object is specified, reject as error
    if(action && !items[0]) return { error: `You can certainly ${action.token} something, but you'll need to specify a valid item to interact with.` };
    
    const output = {
      action: action.token
    };

    !items[action.objectPos] ? output.object = items[0].token : output.object = items[action.objectPos].token;
    
    // console.log(output);

    if(!items[1]) return output;

    output.target = items[action.targetPos].token;

    // console.log(output);

    return output;
  };

  return createOutput();
};

