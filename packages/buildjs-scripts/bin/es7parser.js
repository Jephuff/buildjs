const path = require('path');
const babel = require('babylon');
const depcheck = require('depcheck');
const pify = require('pify');

const es7parser = (content, filename, deps, rootDir) => {
  if (path.basename(rootDir).includes('webpack-config')) {
    console.log('webpack');
  } else if (path.basename(rootDir).includes('babel-preset')) {
    console.log('babel');
  } else if (path.basename(rootDir).includes('eslint-config')) {
    console.log('eslint');
  }
  return (
    babel.parse(content, {
      sourceType: 'module',
      plugins: ['jsx', 'flow'],
    })
  );
};

const options = {
  ignoreBinPackage: false, // ignore the packages with bin entry
  ignoreDirs: ['lib', 'umd'],
  ignoreMatches: [],
  parsers: {
    '*.js': es7parser,
    '*.jsx': es7parser,
  },
  detectors: [
    depcheck.detector.requireCallExpression,
    depcheck.detector.importDeclaration,
  ],
  specials: [
    depcheck.special.eslint,
    depcheck.special.babel,
    depcheck.special.webpack,
  ],
};

module.exports = (d) => (
  // a lookup indicating each dependency is used by which files
  pify(depcheck)(d, options)
);
