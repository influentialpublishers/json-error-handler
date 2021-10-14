module.exports = {
  env: {
    browser: false,
    commonjs: true,
    es6: true,
  },
  extends: 'standard',
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    // List rules in alphabetical order
    camelcase: [
      'error',
      {
        properties: 'never',
        ignoreDestructuring: true,
      },
    ],
    'comma-dangle': [
      'error',
      {
        functions: 'never',
        objects: 'always-multiline',
        arrays: 'always-multiline',
      },
    ],
    'no-unused-vars': [
      'error',
      {
        varsIgnorePattern: 'ignored',
        argsIgnorePattern: '^_',
      },
    ],
    'array-bracket-spacing': [
      'error',
      'always',
      {
        objectsInArrays: false,
      },
    ],
  },
}
