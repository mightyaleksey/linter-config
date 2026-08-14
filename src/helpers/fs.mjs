import { glob } from 'node:fs/promises'
import path from 'node:path'

const globOptions = {
  exclude (file) {
    return file.includes('node_modules')
  }
}

export async function* findFiles (input) {
  for (const param of input) {
    if (param.includes('*')) {
      yield* glob(param, globOptions)
    } else {
      yield path.normalize(param)
    }
  }
}

const jsExtensions = ['.cjs', '.js', '.jsx', '.mjs']

export function isJavaScript (file) {
  return jsExtensions.some((ext) => file.endsWith(ext))
}
