const webpack = require('webpack');
const findCacheDir = require('find-cache-dir');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const config = require('@ncigdc/buildjs-config');

module.exports = {
  module: {
    preLoaders: [],
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel',
        exclude: ['node_modules'],
        include: `${config.get('dir_packages')}`,
        query: {
          babelrc: false,
          presets: ['@ncigdc/buildjs'],
          cacheDirectory: findCacheDir({
            name: '@ncigdc/webpack-config-buildjs-base',
          }),
        },
      },
      {
        test: /\.css$/,
        loader: 'style!css',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        loader: 'file',
        query: {
          name: '[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: '[name].[hash:8].[ext]',
        },
      },
    ],
    noParse: [/\.min\.js$/],
  },
  resolve: {
    extentions: ['', 'js', 'json'],
    modules: ['node_modules'],
  },
  plugins: [
    new webpack.DefinePlugin(config.get('globals')),
    new CaseSensitivePathsPlugin(),
  ],
};
