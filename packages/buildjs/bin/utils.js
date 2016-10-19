const execa = require('execa');
const fs = require('graceful-fs');
const config = require('@ncigdc/buildjs-config');

const PKGS_PATH = `${config.get('path_project')}/packages`;

const findPackageDirs = () => {
  const dirs = fs.readdirSync(PKGS_PATH);

  return dirs;
};

const findModifiedPackageDirs = () => {
  const output = execa.sync('git', ['diff', '--cached', '--dirstat=files,0', '--', 'packages']);
  const lines = output.stdout.split('\n');
  const modifiedPackageDirs = lines.map(l => l.split('/')[1]);

  return modifiedPackageDirs;
};

const findPackageNames = (dirs) => {
  const packageNames = dirs.reduce((acc, d) => Object.assign({}, acc, {
    [d]: require(`${PKGS_PATH}/${d}/package.json`).name,
  }), {});

  return packageNames;
};

const findPackagesToBump = (o) => {
  const pkgMap = o || findPackageNames(findModifiedPackageDirs());
  const modifiedDirs = Object.keys(pkgMap);
  const modifiedPkgs = Object.keys(pkgMap).map(k => pkgMap[k]);

  const dirs = findPackageDirs();

  const modifiedPackageDirs = dirs.reduce((acc, dir) => {
    if (modifiedDirs.includes(dir)) {
      return acc.concat(dir);
    }

    const deps = Object.keys(require(`${PKGS_PATH}/${dir}/package.json`).dependencies || {});

    if (deps.some(dep => modifiedPkgs.includes(dep))) {
      return acc.concat(dir);
    }

    return acc;
  }, []);

  return modifiedPackageDirs;
};


module.exports = {
  findPackageDirs,
  findModifiedPackageDirs,
  findPackageNames,
  findPackagesToBump,
};
