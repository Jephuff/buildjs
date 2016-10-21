const execa = require('execa');
const chalk = require('chalk');
const fs = require('graceful-fs');
const config = require('@ncigdc/buildjs-config');

const findPackagePkg = (d) => require(`${config.get('dir_packages')}/${d}/package.json`)

const findPackageDirs = () => {
  const dirs = fs.readdirSync(config.get('dir_packages'));

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
    [d]: findPackagePkg(d).name,
  }), {});

  return packageNames;
};

const findPackagesToBump = (o) => {
  const pkgMap = o || findPackageNames(findModifiedPackageDirs());

  const modifiedDirs = Object.keys(pkgMap);
  const modifiedPkgs = Object.keys(pkgMap).map(k => pkgMap[k]);

  const dirs = findPackageDirs();
  const modifiedPackageDirs = dirs.reduce((acc, dir) => {
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
    console.log();
    console.log(chalk.bgBlue.white(' COMMAND '));
    console.log(chalk.white(err.cmd));
    console.log();
    console.log(chalk.bgRed.white(' ERROR '));
    console.log(chalk.white(err.stderr.split('\n')[0]));
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
