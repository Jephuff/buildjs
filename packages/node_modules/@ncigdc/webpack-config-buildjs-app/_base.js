const path = require('path');
const merge = require('webpack-merge');
const config = require('@ncigdc/buildjs-config');
const webpackConfig = require('@ncigdc/webpack-config-buildjs-base');

module.exports = merge(webpackConfig, {
  target: 'web',
  devtool: '#source-map',
  entry: {
    bundle: [path.join(config.get('dir_packages'), 'root', 'index.js')],
  },
  output: {
    path: path.join(config.get('dir_dist'), (config.get('globals').__BASE__ || ''), 'js'),
    pathInfo: true,
    publicPath: path.join('/', (config.get('globals').__BASE__ || ''), 'js/'),
    filename: 'bundle.js',
  },
});
