// eslint.config.cjs
const jsdoc = require('eslint-plugin-jsdoc');

module.exports = [
    {
        files: ['src/**/*.js'],
        languageOptions: {
            ecmaVersion: 2022, // ES2022 for full modern syntax
            sourceType: 'module',
            globals: {
                browser: true
            }
        },
        plugins: {
            jsdoc
        },
        rules: {
            // Style
            'brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
            'curly': ['error', 'multi-line', 'consistent'],
            'indent': ['error', 4, { SwitchCase: 1 }],
            'max-len': ['warn', { code: 120 }],
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
            'arrow-parens': ['error', 'as-needed'],
            'object-curly-spacing': ['error', 'always'],
            'no-trailing-spaces': 'error',
            'eol-last': ['error', 'always'],

            // ES6 best practices
            'no-var': 'error',
            'prefer-const': 'warn',

            // Clean code
            'no-unused-vars': 'warn',

            // JSDoc rules
            'jsdoc/require-jsdoc': ['warn', {
                require: {
                    FunctionDeclaration: true,
                    MethodDefinition: false,
                    ClassDeclaration: false,
                    ArrowFunctionExpression: false,
                    FunctionExpression: true
                }
            }],
            'jsdoc/require-param': 'warn',
            'jsdoc/require-returns': 'warn',
            'jsdoc/check-param-names': 'error',
            'jsdoc/check-tag-names': 'error',
            'jsdoc/check-types': 'warn'
        },
        settings: {
            jsdoc: {
                mode: 'typescript'
            }
        }
    }
];