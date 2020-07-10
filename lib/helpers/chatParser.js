const chatParser = (input) => {
  return Promise.resolve(input);
};

const chatAnnounce = (input, io) => {
  io.to('chat').emit('chat', {
    msg: input,
    color: 'grey'
  });
};

module.exports = {
  chatParser,
  chatAnnounce
};
