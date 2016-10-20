const webpack = require('webpack');
const merge = require('webpack-merge');

const config = require('@ncigdc/buildjs-config');
const webpackConfig = require('@ncigdc/webpack-config-buildjs-app/_base');

const devServer = {
  contentBase: `${config.get('dir_packages')}/root`,
  stats: {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false,
  },
  publicPath: webpackConfig.output.publicPath,
};

module.exports = merge(merge(webpackConfig, {
  entry: {
    // need to empty it first because webpack-merge will add them in the wrong order
    bundle: [],
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
  devServer,
}), {
  entry: {
    bundle: [
      // Order matters here
      'react-hot-loader/patch',
      'webpack-hot-middleware/client?reload=true',
      ...webpackConfig.entry.bundle,
    ],
  },
});
