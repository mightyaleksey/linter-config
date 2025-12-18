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

;(async function handleInput () {
  const command = values.fix ? cmdFormat : cmdLint
  const counter = { count: 0 }

  for (const input of positionals) {
    for await (const file of fs.promises.glob(input, {
      exclude: excludeFiles
    })) {
      const abspath = path.resolve(file)
      await command(abspath, counter)
    }
  }
})().catch(console.error)

function excludeFiles (file) {
  return file.includes('node_modules')
}

async function cmdFormat (abspath, counter) {
  const { formatCode } = await import('./c-format.mjs')

  const code = await fs.promises.readFile(abspath, 'utf8')
  const output = await formatCode(code)

  if (output != null && code !== output) {
    await fs.promises.writeFile(abspath, output, 'utf8')
    counter.count++
  }
}

async function cmdLint (abspath, counter) {
  const [{ lintCode }, { printMessage }] = await Promise.all([
    import('./c-lint.mjs'),
    import('./helpers/output.mjs')
  ])

  const code = await fs.promises.readFile(abspath, 'utf8')
  const result = await lintCode(code)

  if (result != null) {
    for (const msg of result.messages) {
      printMessage(msg, code)
      counter.count++
    }
  }
}
