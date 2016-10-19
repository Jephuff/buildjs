const path = require('path');
const merge = require('webpack-merge');
const config = require('@ncigdc/buildjs-config');
const webpackConfig = require('@ncigdc/webpack-config-buildjs-base');

module.exports = merge(webpackConfig, {
  target: 'library',
  output: {
    library: process.env.LIBRARY
    libraryTarget: 'umd',
  },
});
