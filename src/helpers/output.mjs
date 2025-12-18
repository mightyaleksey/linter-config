function findLineStart (code, line) {
  let cursor = 0
  let currentLine = 1

  while (currentLine < line) {
    cursor = code.indexOf('\n', cursor + 1)
    currentLine++
  }

  return cursor > 0 ? cursor + 1 : cursor
}

export function printMessage (msg, code) {
  const lineStart = findLineStart(code, msg.line)
  const lineEnd = code.indexOf('\n', lineStart + 1)
  console.log('[%d:%d] %s', msg.line, msg.column, msg.message)
  console.log(code.substring(lineStart, lineEnd))
  console.log('%s^', ' '.repeat(msg.column - 1))
}
