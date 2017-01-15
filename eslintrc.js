var config = {
  'extends': 'eslint:recommended',
  'rules': {
    'indent': ['warn', 2],
    'no-console': 'off',
    'no-unused-vars': 'warn',
    'quotes': ['warn', 'single', { 'avoidEscape': true }],
    'semi': ['warn', 'always', { 'omitLastInOneLineBlock': true }]
  },
  'parserOptions': {
    'sourceType': 'module',
  },
  'env': {
    'browser': true,
    'es6': true
  }
};

module.exports = config;