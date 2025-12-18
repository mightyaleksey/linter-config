#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'

const { positionals, values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    fix: { type: 'boolean', short: 'f' },
    help: { type: 'boolean', short: 'h' }
  },
  allowPositionals: true
})

if (values.help) {
  console.log(
    'Usage: linter-config [flags] [files]\n' +
      '\n' +
      'Options:\n' +
      '  -f, --fix    Format file and save the changes.\n' +
      '  -h, --help   Pring help.'
  )
  process.exit(0)
}

if (positionals.length === 0) {
  console.log('Empty input.')
  process.exit(0)
}

;(values.fix ? format : lint)().catch(console.error)

async function format () {
  const { fixCode } = await import('./c-lint.mjs')
  const { formatCode } = await import('./c-format.mjs')

  for (const file of positionals) {
    const abspath = path.resolve(file)
    const code = await fs.promises.readFile(abspath, 'utf8')
    const result = await fixCode(code)

    let finalCode = result[0].output != null ? result[0].output : code
    finalCode = await formatCode(finalCode)

    if (code !== finalCode) {
      await fs.promises.writeFile(abspath, finalCode, 'utf8')
    }
  }
}

async function lint () {
  const [{ lintCode }, { printMessage }] = await Promise.all([
    import('./c-lint.mjs'),
    import('./helpers/output.mjs')
  ])

  for (const file of positionals) {
    const abspath = path.resolve(file)
    const code = await fs.promises.readFile(abspath, 'utf8')
    const result = await lintCode(code)

    for (const output of result) {
      for (const msg of output.messages) {
        printMessage(msg, code)
      }
    }
  }
}
