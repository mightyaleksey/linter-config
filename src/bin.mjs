#!/usr/bin/env node

/**
 * To test command line interface locally run:
 * $ npm link
 */

import { parseArgs } from './helpers/cli.mjs'
import { findFiles } from './helpers/fs.mjs'

import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const { positionals, values } = parseArgs({
  fix: { type: 'boolean', short: 'f' },
  help: { type: 'boolean', short: 'h' }
})

async function formatPositionals () {
  const { formatCode } = await import('./c-format.mjs')
  const { sortImports } = await import('./helpers/sort-imports.mjs')

  for await (const file of findFiles(positionals)) {
    const abspath = path.resolve(file)
    const code = await readFile(abspath, 'utf8')
    const output = await formatCode(
      (await sortImports(code, abspath)) ?? code,
      abspath
    )

    if (typeof output === 'string' && code !== output) {
      await writeFile(abspath, output, 'utf8')
    }
  }
}

async function lintPositionals () {
  const { lintCode } = await import('./c-lint.mjs')
  const { printMessage } = await import('./helpers/print.mjs')

  for await (const file of findFiles(positionals)) {
    const abspath = path.resolve(file)
    const code = await readFile(abspath, 'utf8')
    let shown = false

    for await (const message of lintCode(code)) {
      if (!shown) {
        shown = true
        console.log(file)
      }

      printMessage(message)
    }
  }
}

;(values.fix ? formatPositionals : lintPositionals)().catch(console.error)
