const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('@ncigdc/buildjs-config');
const HtmlRemove = require('@ncigdc/webpack-config-buildjs-base/plugins/html-remove');
const webpackConfig = require('./_base');

const LIBS_BUNDLE = 'libs';

module.exports = merge(webpackConfig, {
  entry: {
    [LIBS_BUNDLE]: Object.keys(config.get('dependencies')),
  },
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[id].js',
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin(LIBS_BUNDLE),
    new webpack.optimize.AggressiveMergingPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(path.join(config.get('dir_packages'), 'root', 'index.html')),
      filename: '../index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: true,
      },
    }),
    new HtmlRemove(),
  ],
});
