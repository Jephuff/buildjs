const merge = require('webpack-merge');
const webpackConfig = require('@ncigdc/webpack-config-buildjs-base');

module.exports = merge(webpackConfig, {
  entry: {
    bundle: './index.js',
  },
  output: {
    filename: `umd/${process.env.LIBRARY}.js`,
    library: process.env.LIBRARY,
    libraryTarget: 'umd',
  },
  module: {
    loaders: webpackConfig.module.loaders.map(l => {
      delete l.include; //eslint-disable-line
      return l;
    }),
  },
});
