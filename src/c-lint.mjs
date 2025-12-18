import { ESLint } from 'eslint'

import eslintConfig from '../eslint.config.mjs'

const eslint = new ESLint({
  fix: false,
  overrideConfigFile: true,
  overrideConfig: eslintConfig
})

export async function fixCode (code) {
  const f = new ESLint({
    fix: true,
    overrideConfigFile: true,
    overrideConfig: eslintConfig
  })

  return f.lintText(code)
}

export async function lintCode (code) {
  return eslint.lintText(code)
}
