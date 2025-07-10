import { writeFile, readFile } from 'node:fs/promises'
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
  cache?: boolean
}

export function AutoExportsPlugin(options: AutoExportsPluginOptions = {}) {
  let {
    entryDir = 'src',
    excludeFiles = ['index.ts'],
    extensions = ['ts', 'tsx'],
    contentCallback,
    afterCallback = (content) => {
      return content
    },
    cache = true
  } = options

  const extensionReg = new RegExp(`.(${extensions?.join('|')})$`)

  if (!contentCallback) {
    contentCallback = (relativePath) => {
      return `export * from './${relativePath.replace(extensionReg, '')}'`
    }
  }

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
        console.log(contentCallback(relativePath))
        return contentCallback(relativePath)
      }).filter(Boolean).join(EOL)

      let entryFilePath = join(entryDir, 'index.ts')

      const finalContent = afterCallback(content)

      if (cache) {
        let existingContent = ''
        try {
          existingContent = await readFile(entryFilePath, 'utf-8')
        } catch {
          existingContent = ''
        }
        if (existingContent === finalContent) {
          return
        }
      }

      await writeFile(entryFilePath, finalContent)
      console.info(`Updated ${entryFilePath}`)
    },
  }
}
