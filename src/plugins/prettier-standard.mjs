import estreePlugin from 'prettier/plugins/estree'
import flowPlugin from 'prettier/plugins/flow'

/**
 * Only latest plugin is applied for the same language / parser.
 * Thus, we have to combine all the fixes together here.
 */

function findParentheseGroup (content) {
  if (Array.isArray(content)) {
    if (content.includes('(')) {
      return content
    }

    for (const elem of content) {
      const child = findParentheseGroup(elem)
      if (child != null) {
        return child
      }
    }
  }

  if (content?.type === 'group') {
    return findParentheseGroup(content.contents)
  }

  return null
}

const estreePrinter = estreePlugin.printers.estree

export const parsers = { ...flowPlugin.parsers }

export const printers = {
  estree: {
    ...estreePrinter,

    print (path, options, print) {
      const node = path.getValue()

      if (
        node.type === 'FunctionDeclaration' ||
        node.type === 'FunctionExpression'
      ) {
        const parentNode = path.getParentNode()
        const doc = estreePrinter.print(path, options, print)

        // fix generator function spacing
        if (typeof doc[2] === 'string' && doc[2] === 'function* ') {
          doc[2] = 'function * '
        }

        const group = findParentheseGroup(
          parentNode.type === 'CallExpression' && Array.isArray(doc[2])
            ? doc[2]
            : doc
        )
        // fix space before function parenthese
        if (group != null) group[1] = ' ('

        return doc
      }

      if (node.type === 'YieldExpression') {
        const doc = estreePrinter.print(path, options, print)
        if (doc[0] === 'yield*') doc[0] = 'yield *'
        return doc
      }

      return estreePrinter.print(path, options, print)
    }
  }
}
