import configStandard from 'eslint-config-standard'
import configStandardJSX from 'eslint-config-standard-jsx'
import pluginImport from 'eslint-plugin-import'
import pluginN from 'eslint-plugin-n'
import pluginPrettier from 'eslint-plugin-prettier'
import pluginPromise from 'eslint-plugin-promise'
import pluginReact from 'eslint-plugin-react'
import pluginImportSort from 'eslint-plugin-simple-import-sort'

import { defineConfig } from '@eslint/config-helpers'
import globals from 'globals'
import hermesParser from 'hermes-eslint'

/**
 * Ignored files issue:
 * https://github.com/eslint/eslint/issues/5623
 *
 * Use: eslint .
 */

function useGlobals (env) {
  const output = {}

  env.forEach((key) => {
    const list = globals[key]

    if (list == null) {
      throw new Error(`Unknown environment "${key}"`)
    }

    Object.keys(list).forEach((key) => {
      output[key] = list[key] ? 'writable' : 'readonly'
    })
  })

  return output
}

/**
 * Plugins
 *
 * Make sure to use the proper plugin name as a key when you add it to
 * the plugins list. It should match the plugin name, otherwise
 * it won't work.
 */

export default defineConfig([
  {
    languageOptions: {
      ecmaVersion: configStandard.parserOptions.ecmaVersion,
      parser: hermesParser,
      sourceType: configStandard.parserOptions.sourceType,
      globals: useGlobals(['browser', 'node'])
    },

    name: 'standard',

    plugins: { import: pluginImport, n: pluginN, promise: pluginPromise },

    rules: configStandard.rules
  },
  {
    name: 'standard-jsx',

    plugins: { react: pluginReact },

    rules: configStandardJSX.rules,

    settings: configStandardJSX.settings
  },
  {
    name: 'prettier + overrides',

    files: ['**/*.{js,jsx,mjs}'],

    languageOptions: {
      globals: {
        $Exact: 'readonly',
        $Exports: 'readonly',
        $KeyMirror: 'readonly',
        $Keys: 'readonly',
        $NonMaybeType: 'readonly',
        $ReadOnly: 'readonly',
        $ReadOnlyArray: 'readonly',
        $Values: 'readonly',
        Class: 'readonly',
        Exclude: 'readonly',
        Extract: 'readonly',
        Omit: 'readonly',
        OmitThisParameter: 'readonly',
        Parameters: 'readonly',
        Partial: 'readonly',
        Pick: 'readonly',
        Record: 'readonly',
        Required: 'readonly',
        ReturnType: 'readonly',
        StringPrefix: 'readonly',
        StringSuffix: 'readonly',
        SyntheticAnimationEvent: 'readonly',
        SyntheticCompositionEvent: 'readonly',
        SyntheticDragEvent: 'readonly',
        SyntheticEvent: 'readonly',
        SyntheticFocusEvent: 'readonly',
        SyntheticInputEvent: 'readonly',
        SyntheticKeyboardEvent: 'readonly',
        SyntheticMouseEvent: 'readonly',
        SyntheticTouchEvent: 'readonly',
        SyntheticTransitionEvent: 'readonly',
        SyntheticUIEvent: 'readonly',
        SyntheticWheelEvent: 'readonly',
        ThisParameterType: 'readonly'
      }
    },

    plugins: {
      'simple-import-sort': pluginImportSort,
      prettier: pluginPrettier
    },

    rules: {
      'import/newline-after-import': 'error',
      'multiline-ternary': 'off',
      'react/jsx-props-no-multi-spaces': 'off',
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
])
