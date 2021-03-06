const execa = require('execa');
const chalk = require('chalk');
const fs = require('graceful-fs');
const config = require('@ncigdc/buildjs-config');

const findPackagePkg = (d) => {
  try {
    const pkg = require(`${config.get('dir_packages')}/${d}/package.json`);
    return pkg;
  } catch (err) {
    return {};
  }
};

const findPackageDirs = () => {
  const dirs = fs.readdirSync(config.get('dir_packages'));

  return dirs;
};

const findModifiedPackageDirs = (tag) => {
  const output = execa.sync('git', ['diff', '--dirstat=files,0', tag, '--', 'packages']);
  const lines = output.stdout.split('\n');
  const modifiedPackageDirs = lines.map(l => l.split('/')[1]);

  return modifiedPackageDirs;
};

const findPackageNames = (dirs) => {
  const packageNames = dirs.reduce((acc, d) => Object.assign({}, acc, {
    [d]: findPackagePkg(d).name,
  }), {});

  return packageNames;
};

const findPackagesToBump = (tag) => {
  const pkgMap = findPackageNames(findModifiedPackageDirs(tag));

  const modifiedDirs = Object.keys(pkgMap);
  const modifiedPkgs = Object.keys(pkgMap).map(k => pkgMap[k]);

  const dirs = findPackageDirs();

  const modifiedPackageDirs = dirs.reduce((acc, dir) => {
    if (acc.includes(dir)) return acc;

    const deps = Object.keys(findPackagePkg(dir).dependencies || {});

    if (deps.some(dep => modifiedPkgs.includes(dep))) {
      return acc.concat(dir);
    }

    return acc;
  }, modifiedDirs);

  return modifiedPackageDirs;
};

const catchErrors = err => {
  if (err.cmd) {
    console.log(chalk.bgBlue.white(' COMMAND '));
    console.log(chalk.white(err.cmd));
    console.log();
    console.log(chalk.bgRed.white(' ERROR '));
    if (err.stderr) {
      console.log(chalk.white(err.stderr.split('\n    at')[0]));
    }
    console.log(chalk.white(err.stdout.split('\n    at')[0]));
  } else {
    const PrettyError = require('pretty-error');

    const pe = new PrettyError();
    console.log();
    console.log(pe.render(err));
  }
};

module.exports = {
  catchErrors,
  findPackagePkg,
  findPackageDirs,
  findModifiedPackageDirs,
  findPackageNames,
  findPackagesToBump,
};
