import type { PlopTypes } from '@turbo/gen';
import path from "node:path"
import fs from "node:fs"
import { spawnSync } from 'node:child_process';

type NewPkgAnswers = {
  name: string
  pkgDir: string
  description: string
  private: boolean
  type: 'base' | 'lib' | 'react'
}

export default function (plop: PlopTypes.NodePlopAPI) {
  const pkgScope = "vi-space"

  plop.setActionType('pkgInit', (answers, _config, plopApi) => {
    if (!plopApi) {
      throw new Error('Cannot find plop api.')
    }
    const pkgAnswers = answers as NewPkgAnswers

    if (pkgAnswers.type === 'base') {
      return 'ℹ️  Skipped pnpm install – the "base" package template contains no runtime dependencies.';
    }

    const kebabName = plopApi.getHelper('kebabCase')(pkgAnswers.name);
    const pkgDir = path.resolve(process.cwd(), pkgAnswers.pkgDir, kebabName);

    // Make sure the directory exists before running the install
    if (!fs.existsSync(pkgDir)) {
      return `⚠️  Generation failed: directory ${pkgDir} does not exist`;
    }

    const result = spawnSync('pnpm', ['install'], {
      cwd: pkgDir,
      stdio: 'inherit', // Pipe install output directly to the console
      shell: true,
    });

    if (result.status !== 0) {
      throw new Error(`pnpm install failed in ${pkgDir}`);
    }

    spawnSync('pnpm', ['lint:fix'], {
      cwd: pkgDir,
      stdio: 'inherit',
      shell: true
    })

    return `✅ pnpm install executed in ${pkgDir}`;
  });

  plop.setGenerator('new-pkg', {
    description: 'Add a new common package',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Package name (kebab-case):',
        validate: (v: string) => /^([a-z0-9]+-)*[a-z0-9]+$/.test(v) || 'kebab-case only',
      },
      {
        type: 'input',
        name: 'pkgDir',
        message: 'Destination directory (relative to project root):',
        default: 'packages',
        filter: (inp: string) => inp.trim().replace(/\/+$/, ''),
        validate: (dir: string) => {
          if (!dir.trim()) return 'Directory cannot be empty.';
          const full = path.resolve(dir);
          try {
            fs.accessSync(full);
            return true;
          } catch {
            return `Directory "${dir}" does not exist. Please create it first.`;
          }
        },
      },
      {
        type: 'input',
        name: 'description',
        message: 'Package description:',
      },
      {
        type: 'confirm',
        name: 'private',
        message: 'Is this package private?',
        default: true,
      },
      {
        type: 'list',
        name: 'type',
        message: 'Package type:',
        default: 'base',
        choices: [
          { name: "Base", value: 'base' },
          { name: 'Library', value: 'lib' },
          { name: 'React lib', value: 'react' },
          { name: 'React component', value: 'react-component' }
        ],
      },
    ],

    /** ---------- ACTIONS ---------- */
    actions: (data) => {
      const pkgFolder = path.posix.join(
        '{{pkgDir}}',
        '{{kebabCase name}}'
      );
      return [
        {
          type: 'addMany',
          destination: pkgFolder,
          base: `templates/pkg-templates/{{type}}`,
          templateFiles: `templates/pkg-templates/{{type}}/**/*`,
          data: { ...data, pkgScope: pkgScope },
          skipIfExists: true
        },
        {
          type: 'pkgInit'
        }
      ];
    },
  });
}
