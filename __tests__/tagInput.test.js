const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

// const request = require('supertest');
// const app = require('../lib/app');

const tagInput = require('../lib/lang-processing/tagInput');

describe('tagInput module', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('returns consistent parsing object for USE KEY DOOR', () => {
    const inputA = 'use key door';
    const inputB = 'Use the key on the door';
    const inputC = 'unlock the door with the key';

    const parseObject = { action: 'use', object: 'key', target: 'door' };

    expect(tagInput(inputA)).toEqual(parseObject);
    expect(tagInput(inputB)).toEqual(parseObject);
    expect(tagInput(inputC)).toEqual(parseObject);
  });

  it('returns consistent parsing object for TAKE JARS', () => {
    const inputA = 'take jars';
    const inputB = 'get jars';
    const inputC = 'pick up jars';

    const parseObject = { action: 'take', object: 'jars' };

    expect(tagInput(inputA)).toEqual(parseObject);
    expect(tagInput(inputB)).toEqual(parseObject);
    expect(tagInput(inputC)).toEqual(parseObject);
  });

  it('returns consistent parsing object for LOOK WINDOW', () => {
    const inputA = 'look window';
    const inputB = 'look through the window';
    const inputC = 'inspect the window';

    const parseObject = { action: 'look', object: 'window' };

    expect(tagInput(inputA)).toEqual(parseObject);
    expect(tagInput(inputB)).toEqual(parseObject);
    expect(tagInput(inputC)).toEqual(parseObject);
  });

  it('returns parsing object without a target prop, if none is specified', () => {
    const inputA = 'use book';
    const inputB = 'Use the book';
    const inputC = 'open the book';

    const parseObject = { action: 'use', object: 'book' };

    expect(tagInput(inputA)).toEqual(parseObject);
    expect(tagInput(inputB)).toEqual(parseObject);
    expect(tagInput(inputC)).toEqual(parseObject);
  });

  it('returns the same parsing object for "look entrance", "look room", and "look"', () => {
    const inputA = 'look entrance';
    const inputB = 'look';
    const inputC = 'look room';

    const parseObject = { action: 'look', object: 'entrance' };

    expect(tagInput(inputA)).toEqual(parseObject);
    expect(tagInput(inputB)).toEqual(parseObject);
    expect(tagInput(inputC)).toEqual(parseObject);
  });
});
