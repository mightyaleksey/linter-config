import prettier from 'prettier'

import { isJavaScript } from './helpers/fs.mjs'
import * as plugin from './plugins/prettier-standard.mjs'

import assert from 'node:assert'

const jsConfig = {
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

export async function formatCode (code, source) {
  assert(typeof code === 'string')
  if (isJavaScript(source)) return prettier.format(code, jsConfig)
  return prettier.format(code, { filepath: source })
}
