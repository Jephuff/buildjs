const execa = require('execa');
const Listr = require('listr');

const utils = require('../utils');

const tasks = new Listr([
  {
    title: 'Bump Package Version',
    task: () => execa('npm', ['--no-git-tag-version', 'version', process.env.NEXT_VERSION, '--force']),
  },
]);

module.exports = tasks;

if (!process.env.RELEASE) {
  tasks.run().catch(utils.catchErrors);
}
