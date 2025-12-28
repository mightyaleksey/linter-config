# Linter Config

The package provides shared configuration for eslint and prettier. The rules are set to follow [JavaScript Standard Style](https://standardjs.com), however, deviates from it to provide a way to include your own rules.

## Installation

Install package from git repository (i.e. `pnpm add https://github.com/mightyaleksey/linter-config.git`).

**Note**: `pnpm` users may need to install additional dependencies: `@eslint/config-helpers`, `eslint`, `prettier`, `prettier-plugin-space-before-function-paren`. Due to unflattened _node_modules_ structure, you may not be able to refer those dependencies from eslint config and may not be able run CLI commands.

1. Add script to format files:

```sh
linter-config -f 'src/**/*.mjs'
```

2. Create `eslint.config.mjs` with the following content:

```js
import { defineConfig, globalIgnores } from "@eslint/config-helpers";
import linterConfig from "linter-config/eslint";

export default defineConfig([
  globalIgnores(["flow-typed/", "node_modules/", "**/public/"]),
  { extends: [linterConfig] },
]);
```

## Create a local VSCode extension

1. Clone repository and install dependencies.
2. Open "vscode-extension" and install dependencies too.
3. Run `build` script. This one will build and install extension.
4. Create a shared Visual Studio Code settings, i.e. update `.vscode/settings.json` with the following:

```json
{
  "editor.defaultFormatter": "mightyaleksey.linter-config",
  "editor.formatOnSave": true
}
```

## Appendix

- [Eslint: sharing-multiple-configs](https://eslint.org/docs/latest/extend/shareable-configs#sharing-multiple-configs)
- [Prettier: sharing configurations](https://prettier.io/docs/sharing-configurations)
