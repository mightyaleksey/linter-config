import { colors, status } from './chalk.mjs'

export function printFile (file, time, code) {
  const ms = time[0] * 1e3 + time[1] / 1e6
  const output = `${file} ${colors.gray(ms.toFixed() + 'ms')}`
  console.log(code != null ? output + ' ' + status(code) : output)
}

export function printErrors (messages) {
  const columns = Array(messages.length).fill(0)
  for (const msg of messages) {
    msg.forEach(
      (elem, index) => (columns[index] = Math.max(columns[index], elem.length))
    )
  }

  for (const msg of messages) {
    const line = msg[0].padStart(columns[0] - msg[0].length, ' ')
    const column = msg[1].padEnd(columns[1] - msg[1].length, ' ')
    const output = colors.gray(line + ':' + column) + ' ' + msg[2]
    console.log(output)
  }

  if (columns.length > 0) console.log()
}
