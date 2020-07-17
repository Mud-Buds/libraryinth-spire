const express = require('express');
const app = express();

// keep your logic in this file. your server file should be minimal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

module.exports = app;
