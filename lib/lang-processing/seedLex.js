const library = require('../rooms/library');
const horrorRoom = require('../rooms/horror');

const Item = require('../models/Item');
const lexicon = require('./lexicon');

Promise.resolve(library())
  .then(() => horrorRoom());

const allItems = async() => await Item.find();

const arr = allItems()

arr.forEach(item => console.log(item.name));
