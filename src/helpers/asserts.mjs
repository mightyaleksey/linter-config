import assert from 'node:assert'

export function assertToHaveProperty (obj, prop, message) {
  if (obj[prop] == null) {
    throw new assert.AssertionError({
      message: message ?? `Expected to have property ${prop}.`
    })
  }
}
