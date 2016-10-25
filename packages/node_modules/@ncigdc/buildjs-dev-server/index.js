const chalk = require('chalk');
const path = require('path');
const express = require('express');
const proxy = require('express-http-proxy');
const gzipStatic = require('connect-gzip-static');
const webpack = require('webpack');

const config = require('@ncigdc/buildjs-config');
const webpackConfig = require('@ncigdc/webpack-config-buildjs-app/development');

const host = config.get('webpack_host');
const port = config.get('webpack_port');

const app = express();

const staticDir = config.get('dir_packages');
const indexFile = path.join('root', 'index.html');

app.use(gzipStatic(staticDir));

const compiler = webpack(webpackConfig);

app.use(require('webpack-dev-middleware')(compiler, webpackConfig.devServer));
app.use(require('webpack-hot-middleware')(compiler));

app.use('/api', proxy(config.get('proxy'), {
  forwardPath: req => (
    require('url').parse(req.url).path
  ),
}));

app.get(/^((?!(.js|.css|.ico)).)*$/, (req, res) => {
  res.sendFile(path.join(staticDir, indexFile));
});

app.listen(port, host, () => {
  console.log('⌛  Webpack bundling assets for the first time...');
  console.log(`⚡  Server running at ${chalk.white(`${host}:${port}`)}`);
  console.log(`➾  Proxying ${chalk.white('/api')} to API running at ${chalk.white(config.get('proxy'))}`);
});
