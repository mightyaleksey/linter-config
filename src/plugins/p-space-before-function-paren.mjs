import estreePlugin from 'prettier/plugins/estree'
import flowPlugin from 'prettier/plugins/flow'

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
        const group = findParentheseGroup(
          parentNode.type === 'CallExpression' && Array.isArray(doc[2])
            ? doc[2]
            : doc
        )
        if (group != null) group[1] = ' ('
        return doc
      }

      return estreePrinter.print(path, options, print)
    }
  }
}

function findParentheseGroup (content) {
  if (typeof content === 'string') {
    return null
  }

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

  if (content.type === 'group') {
    return findParentheseGroup(content.contents)
  }

  return null
}
