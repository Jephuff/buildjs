const merge = require('webpack-merge');
const webpackConfig = require('./stage');

module.exports = merge(webpackConfig, {
  output: {
    filename: `umd/${process.env.LIBRARY}.min.js`,
  },
});
