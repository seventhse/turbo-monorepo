import { readFile, writeFile, stat } from "node:fs/promises"
import { join } from "node:path"
import { REPO_ADDRESS } from "./metadata"
import { GitCommit } from "./git"

async function exists(path: string) {
  try {
    await stat(path)
    return true
  } catch (err: any) {
    if (err.code === 'ENOENT') return false
    throw err // 其他错误继续抛出
  }
}

function loadExistingHashes(existing: string): Set<string> {
  const existingHashes = new Set<string>()
  const hashPattern = /\(([a-f0-9]{7,})\)/g
  let match: RegExpExecArray | null
  while ((match = hashPattern.exec(existing)) !== null) {
    existingHashes.add(match[1])
  }
  return existingHashes
}

function groupCommits(commits: GitCommit[]): { feat: GitCommit[]; fix: GitCommit[] } {
  const grouped = {
    feat: [] as GitCommit[],
    fix: [] as GitCommit[],
  }
  for (const commit of commits) {
    if (commit.type === 'feat') {
      grouped.feat.push(commit)
    } else if (commit.type === 'fix') {
      grouped.fix.push(commit)
    }
  }
  return grouped
}

function formatCommits(commits: GitCommit[], type: 'feat' | 'fix'): string {
  if (commits.length === 0) return ''
  const entries = commits
    .map(
      commit =>
        `- ${commit.message} ([${commit.hash}](${REPO_ADDRESS}/commit/${commit.hash}))`
    )
    .join('\n')
  return `### ${type}\n${entries}\n\n`
}

export interface WriteChangelogOptions {
  packageDir: string
  scope: string,
  version: string,
  allCommits: GitCommit[]
}

export async function writeChangelog({ packageDir, scope, version, allCommits }: WriteChangelogOptions) {

  const changelogPath = join(packageDir, 'CHANGELOG.md')
  const changelogStat = await exists(changelogPath)

  // 读取已有内容（如果存在）
  let existing = ''
  if (changelogStat) {
    existing = await readFile(changelogPath, 'utf-8')
  }

  // 如果 CHANGELOG.md 不存在，添加顶部标题
  let prefix = ''
  if (!changelogStat) {
    prefix = `# Changelog - ${scope}\n\n`
  }

  // 提取已有 changelog 中的 commit hash，避免重复
  const existingHashes = loadExistingHashes(existing)

  // 过滤掉已写入过的 commit
  const commits = allCommits.filter(commit => !existingHashes.has(commit.hash))

  if (commits.length === 0) {
    console.log(`No new commits found for scope "${scope}"`)
    return
  }

  const date = new Date().toISOString().slice(0, 10)

  // 检查是否已存在该版本 changelog（防止重复写入）
  const versionHeader = `## ${version} - ${date}`
  if (existing.includes(versionHeader)) {
    console.log(`⚠️  Changelog for version "${version}" already exists for scope "${scope}"`)
    return
  }

  const header = `## ${version} - ${date}\n\n`

  const grouped = groupCommits(commits)

  const featSection = formatCommits(grouped.feat, 'feat')
  const fixSection = formatCommits(grouped.fix, 'fix')

  const section = `${featSection}${fixSection}`

  const updatedChangelog = `${prefix}${header}${section}${existing}`

  await writeFile(changelogPath, updatedChangelog, 'utf-8')

  console.log(`\n✅ Updated changelog for scope "${scope}" at ${changelogPath}`)
}
