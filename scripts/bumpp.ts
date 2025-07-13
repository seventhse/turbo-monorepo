import { versionBump } from "bumpp"
import { readFile, writeFile, stat } from "node:fs/promises"
import { join } from "node:path"
import { execSync } from 'node:child_process'
import process from "node:process"

const baseDir = process.cwd()

const packageList = ['common-ui', 'utils']
const appList = []

async function getPackage(packageDir: string) {
  const packagePath = join(packageDir, 'package.json')
  const packageFile = await readFile(packagePath, 'utf-8')
  return JSON.parse(packageFile)
}


interface GitCommit {
  hash: string
  type: 'feat' | 'fix'
  scope: string
  message: string
}

function getScopedGitCommits(scope: string): GitCommit[] {
  const raw = execSync(
    'git log --pretty=format:"%h %s" --no-merges -n 100',
    { encoding: 'utf-8' }
  )

  const lines = raw.split('\n').filter(line => line.trim() !== '')
  const pattern = /^([a-f0-9]{7,})\s+(feat|fix)\(([^)]+)\):\s+(.+)$/

  const commits: GitCommit[] = []

  for (const line of lines) {
    const match = line.match(pattern)
    console.log(match)
    if (!match) continue

    const [, hash, type, matchedScope, message] = match

    if (matchedScope === scope) {
      commits.push({
        hash,
        type: type as 'feat' | 'fix',
        scope: matchedScope,
        message,
      })
    }
  }

  return commits
}

async function writeChangelog(packageDir: string, scope) {
  const commits = getScopedGitCommits(scope)
  if (commits.length === 0) {
    console.log(`No commits found for scope "${scope}"`)
    return
  }

  const changelogPath = join(packageDir, 'CHANGELOG.md')
  const changelogStat = await stat(changelogPath)

  // 读取已有内容（如果存在）
  let existing = ''
  if (changelogStat.isFile()) {
    existing = await readFile(changelogPath, 'utf-8')
  }

  // 格式化新日志内容
  const newEntries = commits.map(commit => {
    return `- ${commit.type}(${commit.scope}): ${commit.message} (${commit.hash})`
  }).join('\n')

  const header = `## Unreleased Changes\n\n`

  // 合并写入（头部追加）
  const updatedChangelog = `${header}${newEntries}\n\n${existing}`

  await writeFile(changelogPath, updatedChangelog, 'utf-8')

  console.log(`\n✅ Updated changelog for scope "${scope}" at ${changelogPath}`)
}

async function tryBumppPackage() {
  const successMessages: string[] = []
  const errorMessages: string[] = []

  for (const item of [...packageList, ...appList]) {
    const dir = join(baseDir, 'packages', item)

    try {
      const packageInfo = await getPackage(dir)

      if (!packageInfo.name) {
        throw new Error(`Missing "name" field in ${item}/package.json`)
      }

      console.log(`\n📦 Bumping ${packageInfo.name} ...`)

      const res = await versionBump({
        cwd: dir,
        printCommits: false,
        confirm: false,
        commit: false,
        tag: false,
      })

      const msg = ` ${packageInfo.name}: ${res.currentVersion} → ${res.newVersion}`
      successMessages.push(msg)
      writeChangelog(dir, item)
    } catch (e) {
      const reason = e instanceof Error ? e.message : String(e)
      errorMessages.push(`❌ ${item}: ${reason}`)
    }
  }

  // 输出汇总
  console.log('\n\n📝 Bump Summary\n-------------------')

  if (successMessages.length) {
    console.log('\n🎉 Successful bumps:')
    successMessages.forEach(msg => console.log('  ' + msg))
  }

  if (errorMessages.length) {
    console.log('\n⚠️  Failed bumps:')
    errorMessages.forEach(msg => console.log('  ' + msg))
  }
}


tryBumppPackage()
