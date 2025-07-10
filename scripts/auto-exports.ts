import { writeFile } from 'node:fs/promises'
import { readdir, stat } from 'node:fs/promises'
import { EOL } from 'node:os'
import { join, relative } from 'node:path'
import process from 'node:process'

async function traverseDirs(dir: string) {
  const status = await stat(dir).catch((e) => {
    console.error('error: ', e)
    return null
  })
  if (!status || status?.isFile()) {
    return [dir]
  }
  const dirChild = await readdir(dir)
  const result: string[] = []
  await Promise.all(dirChild.map(async (child) => {
    const res = await traverseDirs(join(dir, child))
    result.push(...res)
  }))
  return result
}

export interface AutoExportsPluginOptions {
  entryDir?: string
  excludeFiles?: string[]
  extensions?: string[]
  contentCallback?: (relativePath: string) => string
  afterCallback?: (content: string) => string
}

export function AutoExportsPlugin(options: AutoExportsPluginOptions = {}) {

  const {
    entryDir = 'src',
    excludeFiles = ['index.ts'],
    extensions = ['ts', 'tsx'],
    contentCallback = (relativePath) => {
      return `export * from './${relativePath.replace(extensionReg, '')}'`
    },
    afterCallback = (content) => {
      return content
    }
  } = options

  const extensionReg = new RegExp(`/.(${extensions?.join('|')})$/`)

  return {
    name: 'auto-exports',
    order: 'pre',
    async buildStart() {
      const entryDirAbsolute = join(process.cwd(), entryDir)
      const exportList: string[] = await traverseDirs(entryDirAbsolute)

      const content = exportList.map((item) => {
        const relativePath = relative(entryDir, item)
        if (excludeFiles.includes(relativePath)) {
          return null
        }
        return contentCallback(relativePath)
      }).filter(Boolean).join(EOL)

      let entryFilePath = join(entryDir, 'index.ts')
      await writeFile(entryFilePath, afterCallback(content))
    },
  }
}
