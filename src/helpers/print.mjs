export function printFile (file, time) {
  const ms = time[0] * 1e3 + time[1] / 1e6
  console.log('%s %sms', file, ms.toFixed())
}

export function printTable (messages) {
  const columns = Array(messages.length).fill(0)
  for (const msg of messages) {
    msg.forEach(
      (elem, index) => (columns[index] = Math.max(columns[index], elem.length))
    )
  }

  for (const msg of messages) {
    console.log(
      msg.reduce((s, elem, index) => {
        const delimiter = index === 0 ? ':' : ' '
        return s + elem.padStart(columns[index] - elem.length, ' ') + delimiter
      }, '')
    )
  }

  if (columns.length > 0) console.log()
}
