const merge = require('webpack-merge');
const webpackConfig = require('./stage');

module.exports = merge(webpackConfig, {});
