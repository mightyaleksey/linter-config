import estreePlugin from 'prettier/plugins/estree'
import flowPlugin from 'prettier/plugins/flow'

const estreePrinter = estreePlugin.printers.estree

function findFunctionName (doc) {
  if (doc[0] === '(' && Array.isArray(doc[1])) {
    return findFunctionName(doc[1])
  }

  if (
    doc.some((elem) => typeof elem === 'string' && elem.startsWith('function'))
  ) {
    const nameIndex = doc.findIndex((elem) => Array.isArray(elem))
    if (nameIndex > -1) return doc[nameIndex]
  }

  return null
}

function findParentheseGroup (doc) {
  if (Array.isArray(doc)) {
    if (doc.includes('(')) {
      return doc
    }

    for (const elem of doc) {
      const child = findParentheseGroup(elem)
      if (child != null) {
        return child
      }
    }
  }

  if (doc?.type === 'group') {
    return findParentheseGroup(doc.contents)
  }

  return null
}

export const parsers = { ...flowPlugin.parsers }

export const printers = {
  estree: {
    ...estreePrinter,

    print (path, options, print) {
      const node = path.getValue()
      const doc = estreePrinter.print(path, options, print)

      if (
        node.type === 'FunctionDeclaration' ||
        node.type === 'FunctionExpression'
      ) {
        // console.log(JSON.stringify(doc))
        if (typeof doc[2] === 'string' && doc[2] === 'function* ') {
          doc[2] = 'function * '
        }

        // if (nameGroup != null) {
        //   nameGroup[0] += ' '
        // }

        const nameGroup = findFunctionName(doc)
        const group = findParentheseGroup(doc)
        if (group != null && group !== doc) {
          group[1] = ' ' + group[1]
        } else if (nameGroup != null) {
          nameGroup[0] += ' '
        }
      }

      return doc
    }
  }
}
