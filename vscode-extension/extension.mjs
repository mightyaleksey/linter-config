import * as vscode from 'vscode'

import { formatCode } from '../src/c-format.mjs'
import { sortImports } from '../src/helpers/sort-imports.mjs'

async function format (document) {
  const code = document.getText()
  const source = document.fileName

  const output = await formatCode(
    (await sortImports(code, source)) ?? code,
    source
  )

  return output != null && output !== code ? output : null
}

export function activate (context) {
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider(
      [
        { scheme: 'file', language: 'javascript' },
        { scheme: 'file', language: 'javascriptreact' },
        { scheme: 'file', language: 'json' }
      ],
      {
        async provideDocumentFormattingEdits (document, options, token) {
          const output = await format(document)
          if (output == null) return null

          const range = new vscode.Range(
            document.positionAt(0),
            document.positionAt(document.getText().length)
          )

          return [vscode.TextEdit.replace(range, output)]
        }
      }
    )
  )
}

export function deactivate () {}
