const Listr = require('listr');

const utils = require('../utils');

const tasks = new Listr([
  {
    title: 'Preflight',
    task: () => require('./preflight'),
  },
  {
    title: 'Version',
    task: () => require('./version'),
  },
  {
    title: 'Changelog',
    task: () => require('./changelog'),
  },
  {
    title: 'Publish',
    task: () => require('./publish'),
  },
]);

tasks.run().catch(utils.catchErrors);
