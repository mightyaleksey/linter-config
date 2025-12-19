import prettier from 'prettier'

import * as plugin from './plugins/prettier-standard.mjs'

import assert from 'node:assert'

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
  assert(typeof code === 'string')
  return prettier.format(code, prettierConfig)
}
