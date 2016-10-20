const execa = require('execa');
const UpdaterRenderer = require('listr-update-renderer');
const Listr = require('listr');

const tasks = new Listr([
  {
    title: 'Staging Changes',
    task: () => execa('git', ['add', '.']),
  },
  {
    title: 'Lerna Cross Package Publish',
    task: () => execa('lerna', ['publish', '--repo-version', process.env.NEXT_VERSION, '--yes']),
  },
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
