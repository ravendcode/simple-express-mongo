module.exports = {
  'extends': 'standard',
  'plugins': [
    'standard',
    'promise'
  ],
  'globals': {
    'io': true
  },
  'env': {
    'node': true,
    'mocha': true,
    'browser': true,
    'jquery': true,
  },
  'parserOptions': {
    'ecmaVersion': 6,
    'sourceType': 'module',
    'ecmaFeatures': {
      'jsx': true
    }
  },
  'rules': {
    'indent': 2,
    'semi': 2,
    'quotes': 2,
    'comma-dangle': 0,
    'space-before-function-paren': 0,
    'standard/object-curly-even-spacing': [2, 'either'],
    'standard/array-bracket-even-spacing': [2, 'either'],
    'standard/computed-property-even-spacing': [2, 'even']
  }
}
