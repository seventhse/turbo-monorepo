import { execSync } from 'node:child_process'

export interface GitCommit {
  hash: string
  type: 'feat' | 'fix'
  scope: string
  message: string
}

function getLatestTag(scope: string): string | undefined {
  try {
    return execSync(`git describe --tags --match '${scope}@*' --abbrev=0`, {
      encoding: 'utf-8'
    }).trim()
  } catch {
    return undefined
  }
}

export function getScopedGitCommits(scope: string, length: number = 100): GitCommit[] {
  const sinceTag = getLatestTag(scope)
  const range = sinceTag ? `${sinceTag}..HEAD` : ''

  const raw = execSync(
    `git log ${range} --pretty=format:"%h %s" --no-merges -n ${length}`,
    { encoding: 'utf-8' }
  )

  const lines = raw.split('\n').filter(line => line.trim() !== '')
  const pattern = /^([a-f0-9]{7,})\s+(feat|fix)\(([^)]+)\):\s+(.+)$/

  const commits: GitCommit[] = []

  for (const line of lines) {
    const match = line.match(pattern)
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


export interface AutoTagAndCommit {
  name: string,
  scope: string,
  version: string,
  packageDir: string
}

export function autoTagAndCommit({ name, scope, version, packageDir }: AutoTagAndCommit) {
  const tag = `${name}@${version}`
  const commitMsg = `chore(${scope}): release ${version}`
  execSync(`git add .`, { cwd: packageDir })
  execSync(`git commit -m "${commitMsg}"`, { cwd: packageDir })
  execSync(`git tag ${tag}`, { cwd: packageDir })
}