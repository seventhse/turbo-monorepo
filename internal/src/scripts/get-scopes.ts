import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

// 动态读取 apps 和 packages 子目录名作为 scope
export function getScopes() {
  const dirs = ['apps', 'packages']
  const scopes = []

  for (const dir of dirs) {
    const fullDir = join(process.cwd(), dir)
    try {
      const entries = readdirSync(fullDir, { withFileTypes: true })
      for (const entry of entries) {
        if (entry.isDirectory()) {
          scopes.push(entry.name)
        }
      }
    }
    catch (err) {
      // 路径不存在也跳过
      console.error('Get scope err:', err)
    }
  }

  return ['repo', ...scopes]
}
