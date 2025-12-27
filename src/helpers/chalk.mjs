/**
 * The 256-color palette breakdown
 *
 * 0-15 — system standard colors
 *  0-7 — normal (black, red, green, yellow, blue, magenta, cyan, white)
 *  8-15 — bright versions
 * 16-231 — 6x6x6 RGB color cube
 *  formula code = 16 + 36 * r + 6 * g + b
 *  where r,g,b arc 0-5 (6 levels per channel)
 *  this creates a grid of colors, from muted to vibrant
 * 232-255 — grayscale ramp (24 shades)
 *  232 — almost black
 *  255 — almost white
 */

/**
 * The syntax
 *  foreground \x1b[38;5;<n>m, where <n> is 0-255
 *  background \x1b[48;5;<n>m
 *  reset \x1b[0m
 *
 * Note: \x1b, \e and \033 is the same thing
 */

const controlSequences = [
  ['black', '[30m'],
  ['red', '[31m'],
  ['green', '[32m'],
  ['yellow', '[33m'],
  ['blue', '[34m'],
  ['magenta', '[35m'],
  ['cyan', '[36m'],
  ['white', '[37m'],
  ['gray', '[90m']
]

export const colors = controlSequences.reduce((m, [name, seq]) => {
  m[name] = (text) => `\x1b${seq}${text}\x1b[0m`
  return m
}, {})

export function status (code) {
  switch (code) {
    case -1:
      return colors.white('⋅')
    case 0:
      return colors.green('✓')
    case 1:
      return colors.red('×')
  }
}
