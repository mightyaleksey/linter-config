import prettier from 'prettier'

import config from '../prettier.config.mjs'
import { isJavaScript } from './helpers/fs.mjs'

import assert from 'node:assert'

export async function formatCode (code, source) {
  assert(typeof code === 'string')
  if (isJavaScript(source)) return prettier.format(code, config)
  return prettier.format(code, { filepath: source })
}
