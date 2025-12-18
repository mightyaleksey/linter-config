import prettier from 'prettier'

import * as plugin from './plugins/p-space-before-function-paren.mjs'

const prettierConfig = {
  bracketSpacing: true,
  jsxSingleQuote: true,
  objectWrap: 'collapse',
  parser: 'flow',
  plugins: [plugin],
  printWidth: 80,
  semi: false,
  singleQuote: true,
  trailingComma: 'none',
  useTabs: false
}

export async function formatCode (code) {
  return prettier.format(code, prettierConfig)
}
