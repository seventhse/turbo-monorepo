# @vi-space/eslint-config
vi-space common eslint config.
# @vi-space/eslint-config

Shared ESLint configurations for the `vi-space` monorepo, providing opinionated base rules and presets tailored for different project types including libraries and React apps.

## Available Configurations

### `base`

- Built on top of [`@antfu/eslint-config`](https://github.com/antfu/eslint-config).
- Disables Vue rules (`vue: false`).
- Applies stylistic rules:
  - Indentation of 2 spaces.
  - Single quotes for strings.
- Designed as a foundation to be extended.

### `library`

- Extends `base`.
- Suitable for general library development.
- Applies `type: 'lib'` preset from `@antfu/eslint-config`.

### `react`

- Extends `base`.
- Enables React-specific linting (`react: true`).
- Includes React hooks and React refresh plugin support through dependencies.

## Usage

In your project `.eslintrc` or ESLint config, extend the appropriate configuration:

```json
{
  "extends": [
    "@vi-space/eslint-config/base",
    "@vi-space/eslint-config/react"  // or "library" as needed
  ]
}
```

Or use programmatically:

```js
import eslintConfig from '@vi-space/eslint-config/react';
// Use eslintConfig in your tooling
```

## Dependencies

Make sure to install peer dependencies required by these configs:

- `eslint` 
- `@antfu/eslint-config`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`
- `@eslint-react/eslint-plugin`

---

## Notes

- The package uses ESM (`"type": "module"`).
- The exported configs are accessible via:

  - `@vi-space/eslint-config/base`
  - `@vi-space/eslint-config/library`
  - `@vi-space/eslint-config/react`
