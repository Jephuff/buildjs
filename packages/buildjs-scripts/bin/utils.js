const path = require('path');
const execa = require('execa');
const chalk = require('chalk');

const fs = require('graceful-fs');
const config = require('@ncigdc/buildjs-config');

const es7parser = require('./es7parser');

const findDeps = d => (
  es7parser(d)
  .then(data => [])
  .catch(res => {
    // weird library that only returns errors
    if (res.code) return catchErrors(res);
    return Object.keys(res.using);
  })
);

const getDependencyVersion = (dep, topDeps, localPkgs, modifiedPkgs, dir) => {
  const localPkgsNames = Object.keys(localPkgs).map(k => localPkgs[k]);

  if (modifiedPkgs.map(mp => localPkgs[mp]).includes(dep)) return process.env.NEXT_VERSION;
  else if (localPkgsNames.includes(dep)) {
    const pkg = findPackagePkg(path.join(config.get('dir_packages'), dir));
    return pkg.version;
  } else {
    return topDeps[dep];
  }
}

const updatePkgDeps = ({ pkg, topPkg, deps, localPkgs, modifiedPkgs, dir }) => (
  Object.assign({},
    pkg,
    {
      main: "lib/index.js",
      "jsnext:main": "es6/index.js",
      browser: `umd/${dir}.min.js`,
      files: ["*.md", "docs", "es", "lib", "umd"],
      repository: topPkg.repository,
      engines: topPkg.engines,
      author: topPkg.author,
      homepage: topPkg.homepage,
      license: topPkg.license,
      bugs: topPkg.bugs,
      tags: topPkg.tags,
      keywords: topPkg.keywords,
      dependencies: deps.filter(d => (
        !Object.keys(topPkg.peerDependencies || {}).includes(d)
      )).reduce((acc, d) => {
        return Object.assign(acc, {
          [d]: getDependencyVersion(d, topPkg.dependencies, localPkgs, modifiedPkgs, dir)
        })
      }, {}),
      peerDependencies: deps.filter(d => (
        Object.keys(topPkg.peerDependencies || {}).includes(d)
      )).reduce((acc, d) => {
        return Object.assign(acc, {
          [d]: parseInt(topPkg.dependencies[d], 10).toString(),
        })
      }, {}),
    }
  )
);

const findPackagePkg = (d) => {
  try {
    const pkg = require(path.join(d, 'package.json'));
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
  const modifiedPackageDirs = lines.map(l => l.split('/')[1]).filter(Boolean);

  return modifiedPackageDirs;
};

const findPackageNames = (dirs) => {
  const packageNames = (dirs || []).reduce((acc, d) => Object.assign({}, acc, {
    [d]: findPackagePkg(path.join(config.get('dir_packages'), d)).name,
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

const catchErrors = (err) => {
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
  findDeps,
  updatePkgDeps,
  catchErrors,
  findPackagePkg,
  findPackageDirs,
  findModifiedPackageDirs,
  findPackageNames,
  findPackagesToBump,
};
