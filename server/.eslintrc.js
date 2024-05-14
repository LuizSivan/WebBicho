module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 2,
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    indent: ['error', 2, { SwitchCase: 4 }],
    '@typescript-eslint/no-unused-vars': 'off',
    'no-trailing-spaces': ['error', { skipBlankLines: true }],
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 4 }],
    'no-multi-spaces': ['error', { ignoreEOLComments: true }],
  },
};
