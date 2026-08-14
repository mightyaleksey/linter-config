import * as plugin from './src/plugins/prettier-standard.mjs'

const config = {
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

export default config
