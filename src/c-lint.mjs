import { ESLint } from 'eslint'

import eslintConfig from '../eslint.config.mjs'

const eslint = new ESLint({
  fix: false,
  overrideConfigFile: true,
  overrideConfig: eslintConfig
})

export async function* lintCode (code) {
  const output = await eslint.lintText(code)

  for (const result of output) {
    for (const message of result.messages) {
      yield message
    }
  }
}
