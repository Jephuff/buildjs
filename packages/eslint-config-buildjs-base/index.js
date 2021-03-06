const config = require('@ncigdc/buildjs-config');

const eslintrc = {
  extends: ['airbnb-base', 'cleanjs'],
  rules: {
    'no-underscore-dangle': 0,
    'arrow-parens': 0,
    'no-extra-boolean-cast': 0,
    'max-len': [2, 120],
    'no-duplicate-imports': 0,

    // ###  import
    'import/no-duplicates': 'error',
    // our src modules are in node_modules but not package.json
    'import/no-extraneous-dependencies': 0,
    // I just found these two kind of annoying
    'import/no-named-as-default-member': 0,
    'import/prefer-default-export': 0,

    // ###  fp
    // need nulls for GraphQL variables
    'fp/no-nil': 0,
    // Tests blow up with this
    'fp/no-unused-expression': 0,

    // ###  better
    // we might want the use new Set/Map
    'better/no-new': 0,
    // already have a rule against nested ternary
    'better/no-ifs': 0,
    // Tests blow up with this
    'better/explicit-return': 0,
  },
  plugins: [
    'better',
    'fp',
  ],
  globals: Object.keys(config.get('globals')).reduce((acc, k) => (
    Object.assign({}, acc, {
      [k]: true,
    })
  ), {}),
};

module.exports = eslintrc;
