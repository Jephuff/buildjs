const execa = require('execa');
const UpdaterRenderer = require('listr-update-renderer');
const Listr = require('listr');

const config = require('@ncigdc/buildjs-config');

const utils = require('../utils');

const tasks = new Listr([
  {
    title: 'Linkings packages',
    task: () => {
      const dirs = utils.findPackageDirs();
      const ts = dirs.map(d => ({
        title: `Building ${d}`,
        task: () => execa(
          'webpack',
          ['--config', 'packages/buildjs/bin/webpack.config.js']),
      }));

      return new Listr(ts, { concurrent: true });
    },
  },
  // {
  //   title: 'Staging Changes',
  //   task: () => execa('git', ['add', '.']),
  // },
  // {
  //   title: 'Lerna Cross Package Publish',
  //   task: () => execa('lerna', ['publish', '--repo-version', process.env.NEXT_VERSION, '--yes']),
  // },
], {
  renderer: UpdaterRenderer,
  collapse: false,
});

module.exports = tasks;

if (!process.env.RELEASE) {
  tasks.run().catch(err => {
    console.error(err.message);
  });
}
