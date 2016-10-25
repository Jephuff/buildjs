const merge = require('webpack-merge');
const webpackConfig = require('@ncigdc/webpack-config-buildjs-base');
const config = require('@ncigdc/buildjs-config');

module.exports = merge(webpackConfig, {
  output: {
    libraryTarget: 'umd',
  },
  externals: Object.keys(config.get('peerDependencies')),
  module: {
    loaders: webpackConfig.module.loaders.map(l => {
      delete l.include; //eslint-disable-line
      return l;
    }),
  },
});
