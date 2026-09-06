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
  all: { type: 'boolean', short: 'a' },
  fix: { type: 'boolean', short: 'f' },
  help: { type: 'boolean', short: 'h' }
})

async function formatPositionals () {
  const { formatCode } = await import('./c-format.mjs')

  const { sortImports } = await import('./helpers/sort-imports.mjs')
  const { printFile } = await import('./helpers/print.mjs')

  for await (const file of findFiles(positionals)) {
    const timeStart = process.hrtime()
    const abspath = path.resolve(file)
    const code = await readFile(abspath, 'utf8')
    const output = await formatCode(
      (await sortImports(code, abspath)) ?? code,
      abspath
    )

    const wasChanged = typeof output === 'string' && code !== output
    if (wasChanged) {
      await writeFile(abspath, output, 'utf8')
    }

    const timeEnd = process.hrtime(timeStart)
    printFile(file, timeEnd, wasChanged ? 0 : -1)
  }
}

async function lintPositionals () {
  const { lintCode } = await import('./c-lint.mjs')
  const { printFile, printErrors } = await import('./helpers/print.mjs')

  const limit = values.all ? Number.POSITIVE_INFINITY : 5
  let counter = 0

  for await (const file of findFiles(positionals)) {
    const timeStart = process.hrtime()
    const messages = []
    const abspath = path.resolve(file)
    const code = await readFile(abspath, 'utf8')

    for await (const msg of lintCode(code)) {
      messages.push([String(msg.line), String(msg.column), msg.message])

      counter++
      if (counter === limit) break
    }

    const timeEnd = process.hrtime(timeStart)
    printFile(file, timeEnd, messages.length > 0 ? 1 : 0)
    printErrors(messages)

    if (counter === limit) break
  }
}

;(values.fix ? formatPositionals : lintPositionals)().catch(console.error)
