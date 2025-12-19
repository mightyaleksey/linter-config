import { assertToHaveProperty } from './assert.mjs'

import assert from 'node:assert'

/**
 * Parses command line arguments
 *
 * @param {Object.<string, {
 *  short: string
 * }>} flags
 * @returns
 */
export function parseArgs (flags) {
  const positionals = []
  const values = {}

  // create map of flags to full name
  const options = {}
  if (flags != null) {
    Object.keys(flags).forEach((flag) => {
      options['--' + flag] = flag
      if (flags[flag].short != null) {
        options['-' + flags[flag].short] = flag
      }
    })
  }

  let cursor = 2
  while (cursor < process.argv.length) {
    const param = process.argv[cursor]
    if (!param.startsWith('-')) break
    assertToHaveProperty(options, param)
    values[options[param]] = true
    cursor++
  }

  while (cursor < process.argv.length) {
    const param = process.argv[cursor]
    assert(!param.startsWith('-'))
    positionals.push(param)
    cursor++
  }

  return { positionals, values }
}
