const babelConfig = require('@ncigdc/babel-preset-buildjs');
const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer(babelConfig);
