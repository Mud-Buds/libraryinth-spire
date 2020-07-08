module.exports = [
  // 'use' command + aliases
  {
    token: 'use',
    tag: 'ACT',
    targetPos: 1,
    objectPos: 0
  },
  {
    token: 'open',
    tag: 'ACT',
    aliasFor: 'use',
    targetPos: 0,
    objectPos: 1
  },
  {
    token: 'try',
    tag: 'ACT',
    aliasFor: 'use',
    targetPos: 1,
    objectPos: 0
  },
  {
    token: 'put',
    tag: 'ACT',
    aliasFor: 'use',
    targetPos: 1,
    objectPos: 0
  },
  {
    token: 'lock',
    tag: 'ACT',
    aliasFor: 'use',
    targetPos: 0,
    objectPos: 1
  },
  {
    token: 'unlock',
    tag: 'ACT',
    aliasFor: 'use',
    targetPos: 0,
    objectPos: 1
  },
  // 'look' command + aliases
  {
    token: 'look',
    tag: 'ACT'
  },
  {
    token: 'examine',
    tag: 'ACT',
    aliasFor: 'look'
  },
  {
    token: 'inspect',
    tag: 'ACT',
    aliasFor: 'look'
  },
  {
    token: 'search',
    tag: 'ACT',
    aliasFor: 'look'
  },
  {
    token: 'observe',
    tag: 'ACT',
    aliasFor: 'look'
  },
  // 'take' command + aliases
  {
    token: 'take',
    tag: 'ACT'
  },
  {
    token: 'get',
    tag: 'ACT',
    aliasFor: 'take'
  },
  {
    token: 'grab',
    tag: 'ACT',
    aliasFor: 'take'
  },
  {
    token: 'pick',
    tag: 'ACT',
    aliasFor: 'take'
  },
  {
    token: 'remove',
    tag: 'ACT',
    aliasFor: 'take'
  },
  // example items
  {
    token: 'key',
    tag: 'ITM'
  },
  {
    token: 'door',
    tag: 'ITM'
  },
];
