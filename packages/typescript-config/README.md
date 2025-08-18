# @vi-space/typescript-config
vi-space common typescript config.
# @vi-space/typescript-config

Shared TypeScript configurations for the `vi-space` monorepo. This package provides modular `tsconfig` files for different development targets, including web, React, and library builds.

## Overview

This package contains the following configuration presets:

### `base.json`

> Core configuration shared across all environments.

- Targets modern JavaScript (`ES2022`) with ESM (`ESNext`)
- Uses `moduleResolution: "bundler"` for modern bundlers like Vite, SWC
- Strict type-checking enabled (`strict`, `noImplicitOverride`, etc.)
- Optimized for IDEs and CI (`skipLibCheck`, `isolatedModules`, `verbatimModuleSyntax`)


### `node.json`

> Extends `base.json` for Node.js projects using native ESM.

- Sets `module` to `"ESNext"` for ESM support.
- Uses classic Node module resolution (`moduleResolution: "node"`).
- Includes only Node.js and modern ECMAScript libs (`lib: ["ES2022"]`).
- Adds Node.js types (`types: ["node"]`).
- Typically excludes build artifacts and coverage folders.

### `web.json`

> Extends `base.json` with browser-related settings.

- Adds DOM library support (`lib: ["DOM", "DOM.Iterable", "ES2022"]`)
- Preserves JSX syntax for downstream transformers (`jsx: "preserve"`)

### `react.json`

> Extends `web.json` with React-specific settings.

- Enables the React 17+ automatic JSX transform (`jsx: "react-jsx"`)
- Includes React types for IDE support (`types: ["react", "react-dom"]`)

### `library.json`

> Extends `web.json` for packages that only emit types.

- Outputs declaration files (`declaration`, `declarationMap`)
- Emits no JavaScript (`emitDeclarationOnly: true`) — assumes bundler handles `.js`

## Usage

In each package, create a `tsconfig.json` like this:

```json
{
  "extends": "@vi-space/typescript-config/react.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "dist",
    "composite": true
  }
}
```

Choose the most appropriate base config (`web`,`node`, `react`, `library`) depending on the target use case.
