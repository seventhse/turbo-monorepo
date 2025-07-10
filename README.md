# VISpace

## Packages

This monorepo is structured with the following internal packages:

- `@vi-space/typescript-config` — Shared TypeScript configurations for web, React, Node, and library builds.
- `@vi-space/eslint-config` — Centralized ESLint presets for base, React, and library-specific rules.
- `@vi-space/ui` — React-based UI component library for shared design system.
- `@vi-space/utils` — Internal utility functions used across frontend and backend.


## Commit Guidelines

This project follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification, enforced by `commitlint` and facilitated with the interactive tool `git-cz`.

### 1. Commit Types (`type`)

| Type     | Description                              |
| -------- | ---------------------------------------- |
| feat     | A new feature                            |
| fix      | A bug fix                                |
| docs     | Documentation changes                    |
| style    | Code style changes (no logic)            |
| refactor | Code refactoring                         |
| perf     | Performance improvements                 |
| test     | Adding or modifying tests                |
| chore    | Build process or auxiliary tools changes |
| build    | Changes affecting build system           |
| ci       | Continuous Integration changes           |

### 2. Scope

The scope is **required** and should be one of the internal packages or modules, for example:

- `admin-web`
- `common-ui`
- `eslint-config`
- `typescript-config`
- `utils`

### 3. Commit Message Format

```
<type>(<scope>): <short description>
```

**Examples:**

```
feat(admin-web): add login functionality
fix(utils): fix date parsing bug
docs: update README documentation
```

### 4. Interactive Commit

Use the interactive commit command for guided commit messages:

```bash
pnpm run commit
```

Follow the prompts to select the commit type, scope, and enter a description to ensure consistency.

### 5. Commit Validation

The project integrates `commitlint` which automatically validates commit messages on every commit. Commits that don't follow the specification will be rejected.

---

This helps maintain a clean and consistent commit history for the project.  

