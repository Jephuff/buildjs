const path = require('path');
const readPkgUp = require('read-pkg-up');

const pkg = readPkgUp.sync().pkg;
const config = new Map();

// ------------------------------------
// Project
// ------------------------------------
config.set('path_project', process.env.PWD);
// ------------------------------------
// User Configuration
// ------------------------------------
// NOTE: Due to limitations with Webpack's custom require, which is used for
// looking up all *.test.js files, if you edit dir_test you must also edit
// the path in ~/karma.entry.js.
config.set('dir_packages', path.join(config.get('path_project'), 'packages'));
config.set('dir_dist', path.join(config.get('path_project'), 'dist'));

// ------------------------------------
// Webpack
// ------------------------------------
config.set('webpack_host', process.env.HOST || 'localhost');
config.set('webpack_port', process.env.PORT || 8080);
config.set('webpack_public_path',
  `http://${config.get('webpack_host')}:${config.get('webpack_port')}/`
);
config.set('proxy', process.env.PROXY || 'http://localhost:5000');

/*  *********************************************
-------------------------------------------------

All Internal Configuration Below
Edit at Your Own Risk

-------------------------------------------------
************************************************/
// ------------------------------------
// Environment
// ------------------------------------
const pkgGlobals = ((pkg.buildjs || {}).config || {}).globals || {};
config.set('globals', Object.assign(
  {},
  {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      TEST_ENV: JSON.stringify(process.env.TEST_ENV),
    },
    DEBUG: parseInt(process.env.DEBUG, 10) === 1,
    BASE: JSON.stringify(process.env.BASE) || '',
  },
  Object.keys(pkgGlobals).reduce((acc, k) => {
    acc[k] = JSON.stringify(process.env[k] || pkgGlobals[k]);
    return acc;
  }, {})
));

// ------------------------------------
// Utilities
// ------------------------------------
config.set('dependencies', pkg.dependencies || {});
config.set('peerDependencies', pkg.peerDependencies || {});

module.exports = config;
