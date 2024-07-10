module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: [
        '@stylistic',
        '@stylistic/ts',
        '@typescript-eslint',
        '@typescript-eslint/eslint-plugin',
    ],
    extends: ['plugin:@typescript-eslint/recommended'],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/typedef': [
            'error',
            {
                'variableDeclaration': true
            }
        ],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-trailing-spaces': ['error', {skipBlankLines: true}],
        '@stylistic/newline-per-chained-call': ['error', {ignoreChainWithDepth: 2}],
        'no-multi-spaces': ['error', {ignoreEOLComments: true}],
        'brace-style': ['error', '1tbs', {allowSingleLine: true}],
        '@stylistic/semi': ['error', 'always'],
        'function-paren-newline': ['error', 'consistent'],
        '@stylistic/quotes': ['error', 'single', {allowTemplateLiterals: true}],
        '@stylistic/ts/type-annotation-spacing': 'error',
        '@stylistic/object-curly-newline': ['error', {
            'ObjectExpression': {'consistent': true},
            'ObjectPattern': {'multiline': true, 'minProperties': 3},
            'ImportDeclaration': {'multiline': true, 'minProperties': 3},
            'ExportDeclaration': {'multiline': true, 'minProperties': 3}
        }],
        '@stylistic/indent': [
            'error',
            'tab',
            {
                SwitchCase: 1,
                MemberExpression: 2,
                ArrayExpression: 1,
                ObjectExpression: 1,
                flatTernaryExpressions: false,
                offsetTernaryExpressions: true,
                FunctionDeclaration: {
                    parameters: 2,
                    body: 1
                },
                FunctionExpression: {
                    parameters: 2,
                    body: 1,
                },
                CallExpression: {
                    arguments: 2,
                },
                ImportDeclaration: 1,
                ignoredNodes: [
                    `FunctionExpression > .params[decorators.length > 0]`,
                    `ClassBody.body > PropertyDefinition[decorators.length > 0] > .key`,
                    `FunctionExpression > .params > :matches(Decorator, :not(:first-child))`,
                ],
            },
        ],
    },
};
