module.exports = {
  extends: ['@ncigdc/buildjs-base'],
  env: {
    node: true,
  },
  rules: {
    'global-require': 0,
    'import/no-commonjs': 0,
    'fp/no-mutation': ['error', {
      commonjs: true,
    }],
  },
};
