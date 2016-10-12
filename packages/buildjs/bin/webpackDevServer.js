const path = require('path');
const express = require('express');
const proxy = require('express-http-proxy');
const gzipStatic = require('connect-gzip-static');
const webpack = require('webpack');

const config = require('@ncigdc/buildjs-config');
const webpackConfig = require('@ncigdc/webpack-config-buildjs');

const app = express();

const isDevelopment = process.env.NODE_ENV === 'development';
const staticDir = config.get(isDevelopment ? 'dir_packages' : 'dir_dist');
const indexFile = path.join(isDevelopment ? 'root' : config.get('globals').BASE, 'index.html');

app.use(gzipStatic(staticDir));

if (isDevelopment) {
  const compiler = webpack(webpackConfig);

  app.use(require('webpack-dev-middleware')(compiler, webpackConfig.devServer));
  app.use(require('webpack-hot-middleware')(compiler));

  console.log('⌛  Webpack bundling assets for the first time...');
}

app.use('/api', proxy(config.get('proxy'), {
  forwardPath: req => (
    require('url').parse(req.url).path
  ),
}));

app.get(/^((?!(.js|.css|.ico)).)*$/, (req, res) => {
  res.sendFile(path.join(staticDir, indexFile));
});

module.exports = app;
