import pluginImportSort from 'eslint-plugin-simple-import-sort'

import { ESLint } from 'eslint'
import hermesParser from 'hermes-eslint'

import { isJavaScript } from './fs.mjs'

import assert from 'node:assert'

/**
 * Lightweight version of eslint configuration so we can apply
 * the same "sort imports" settings together with the prettier.
 */
const eslintConfig = {
  languageOptions: { parser: hermesParser },

  linterOptions: { reportUnusedDisableDirectives: 'off' },

  name: 'sort-imports',

  plugins: { 'simple-import-sort': pluginImportSort },

  rules: {
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Side effect imports.
          ['^\\u0000'],
          // Move eslint customization to separate group.
          ['^eslint-config', '^eslint-plugin'],
          // Packages.
          // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
          ['^@?\\w'],
          // Absolute imports and other imports such as Vue-style `@/foo`.
          // Anything not matched in another group.
          ['^'],
          // Relative imports.
          // Anything that starts with a dot.
          ['^\\.'],
          // Node.js builtins prefixed with `node:`.
          ['^node:'],
          // Move react dependency to the end.
          ['^react']
        ]
      }
    ]
  }
}

const eslint = new ESLint({
  fix: true,
  overrideConfigFile: true,
  overrideConfig: eslintConfig
})

export async function sortImports (code, source) {
  if (!isJavaScript(source)) return null
  assert(typeof code === 'string')
  const output = await eslint.lintText(code)
  return output[0].output
}
