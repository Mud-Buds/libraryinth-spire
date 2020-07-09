const chatParser = (input) => {
  console.log(input);
  return Promise.resolve(input);
};

const chatAnnounce = (input, io) => {
  console.log('aaaaaaaa ', input);
  io.emit('chat', {
    msg: input,
    color: 'grey'
  });
};

module.exports = {
  chatParser,
  chatAnnounce
};
