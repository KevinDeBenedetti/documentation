// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      'indent': ['error', 2, {
        'SwitchCase': 1,
        'ignoredNodes': ['TemplateLiteral']
      }],
      'vue/html-indent': ['error', 2],
      'vue/script-indent': ['error', 2, {
        'baseIndent': 0,
        'switchCase': 1
      }],
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      'comma-dangle': ['error', 'never'],
      'arrow-parens': ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'space-before-function-paren': ['error', 'always']
    }
  }
)
