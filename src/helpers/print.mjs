function appendZero (num) {
  return num < 10 ? `0${num}` : String(num)
}

export function printMessage (message) {
  console.log(
    '%s:%s %s',
    appendZero(message.line),
    appendZero(message.column),
    message.message
  )
}
