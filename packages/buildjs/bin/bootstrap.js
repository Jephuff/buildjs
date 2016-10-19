const execa = require('execa');
const UpdaterRenderer = require('listr-update-renderer');
const Listr = require('listr');
const config = require('@ncigdc/buildjs-config');

const utils = require('./utils');

const PKGS_PATH = `${config.get('path_project')}/packages`;

const tasks = new Listr([
  {
    title: 'Linkings packages',
    task: () => {
      const dirs = utils.findPackageDirs();
      const ts = dirs.map(d => ({
        title: `Linking ${d}`,
        task: () => execa('yarn', ['link'], { cwd: `packages/${d}` }),
      }));

      return new Listr(ts, { concurrent: true });
    },
  },
  {
    title: 'Symlink packages',
    task: () => {
      const dirs = utils.findPackageDirs();
      const pkgs = utils.findPackageNames(dirs);
      const names = dirs.map(d => pkgs[d]);

      const ts = dirs.reduce((acc, dir) => {
        const deps = Object.keys(require(`${PKGS_PATH}/${dir}/package.json`).dependencies || {});

        const localDeps = deps.filter(dep => names.includes(dep));

        if (localDeps.length > 0) {
          return acc.concat({
            title: `Symlinking ${dir} to local dependencies`,
            task: () => execa('yarn', ['link', ...localDeps], { cwd: `packages/${dir}` }),
          });
        }

        return acc;
      }, []);

      return new Listr(ts);
    },
  },
  {
    title: 'Installing dependencies',
    task: () => execa('yarn'),
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
