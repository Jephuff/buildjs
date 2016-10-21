const execa = require('execa');
const upperCamelCase = require('uppercamelcase');
const UpdaterRenderer = require('listr-update-renderer');
const Listr = require('listr');

const config = require('@ncigdc/buildjs-config');

const utils = require('../utils');

const tasks = new Listr([
  {
    title: 'Building umd',
    task: () => {
      const modifiedPkgs = utils.findPackagesToBump();
      return new Listr(modifiedPkgs.map(d => {
        const pkg = utils.findPackagePkg(d);
        return {
          title: `Building umd for ${d}`,
          skip: () => pkg.private || !pkg.browser,
          task: () => execa('webpack', [
            `${config.get('dir_packages')}/${d}/${pkg.main}`,
            `${config.get('dir_packages')}/${d}/umd/${pkg.browser}`,
            '--config', 'node_modules/@ncigdc/webpack-config-buildjs-lib',
            '--output-library', upperCamelCase(d),
          ]),
        };
      }));
    },
  },
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
  tasks.run().catch(utils.catchErrors);
}
