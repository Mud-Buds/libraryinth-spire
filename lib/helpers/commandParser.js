const commandParser = (input) => {
  console.log('command: ' + input);

  const parsed = input.split(' ');

  // example error
  // if(parsed.length < 2) return Promise.reject({
  //   msg: 'error',
  //   color: 'red'
  // });

  const command = parsed[0]; // /login

  return Promise.resolve({ 
    msg: '> <span style="font-style: italic;">' + input + '</span>',
    color: 'grey'
  });
};

module.exports = {
  commandParser
};
