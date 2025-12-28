import * as vscode from 'vscode'

import { formatCode } from '../src/c-format.mjs'
import { sortImports } from '../src/helpers/sort-imports.mjs'

async function formatDocument (document) {
  const code = document.getText()
  const source = document.fileName

  const output = await formatCode(
    (await sortImports(code, source)) ?? code,
    source
  )

  if (output != null && code !== output) {
    const range = new vscode.Range(
      document.positionAt(0),
      document.positionAt(code.length)
    )

    const workspaceEdit = new vscode.WorkspaceEdit()
    workspaceEdit.replace(document.uri, range, output)
    await vscode.workspace.applyEdit(workspaceEdit)
    await document.save()
  }
}

export function activate (context) {
  const provider = {
    provideDocumentFormattingEdits (document) {
      formatDocument(document)
    }
  }

  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider(
      ['javascript', 'json'],
      provider
    )
  )

  const disposable = vscode.commands.registerCommand(
    'linter-config.format',
    async () => {
      const activeEditor = vscode.window.activeTextEditor

      if (activeEditor != null) {
        try {
          await formatDocument(activeEditor.document)
        } catch (err) {
          vscode.window.showErrorMessage('Formatting failed: ' + err.message)
        }
      }
    }
  )

  context.subscriptions.push(disposable)
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((document) => {
      vscode.commands.executeCommand('linter-config.format')
    })
  )

  console.log('Linter Config extension is active.')
}

export function deactivate () {}
