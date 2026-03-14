import stylistic from '@stylistic/eslint-plugin';

export default [
  stylistic.configs.customize(
    {
      'semi': true,
      'quotes': 'single',
      'indent': 2,
      'quoteProps': 'always',
    },
  ),
  {
    'plugins': {
      '@stylistic': stylistic,
    },
    'rules': {
      '@stylistic/object-curly-newline': ['error', { 'consistent': true }],
    },
  },
];
