import { versionBump } from "bumpp"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { writeChangelog } from "./changelog"
import { Metadata } from "./metadata"
import process from "node:process"
import { autoTagAndCommit, getScopedGitCommits } from "./git"

const baseDir = process.cwd()

async function getPackage(packageDir: string) {
  const packagePath = join(packageDir, 'package.json')
  const packageFile = await readFile(packagePath, 'utf-8')
  return JSON.parse(packageFile)
}


async function processPackage({ type, name }: { type: string, name: string }): Promise<string | null> {
  const dir = join(baseDir, type, name)
  const packageInfo = await getPackage(dir)

  if (!packageInfo.name) {
    throw new Error(`Missing "name" field in ${name}/package.json`)
  }

  const scopedCommits = getScopedGitCommits(name)
  if (scopedCommits.length === 0) {
    return null
  }

  const res = await versionBump({
    cwd: dir,
    printCommits: false,
    confirm: false,
    commit: false,
    tag: false,
  })

  await writeChangelog({
    packageDir: dir,
    scope: name,
    version: res.newVersion,
    allCommits: scopedCommits
  })

  await autoTagAndCommit({
    name: packageInfo.name,
    scope: name,
    version: res.newVersion,
    packageDir: dir
  })

  return `${packageInfo.name}: ${res.currentVersion} → ${res.newVersion}`
}

export async function tryBumppPackage() {
  const successMessages: string[] = []
  const errorMessages: string[] = []

  for (const meta of Metadata) {
    try {

      if (!getScopedGitCommits(meta.name).length) {
        console.log(`ℹ️  No feat/fix commits for ${meta.name}, skipping...`)
        continue
      }

      const msg = await processPackage(meta)
      if (msg) successMessages.push(msg)
    } catch (e) {
      const reason = e instanceof Error ? e.message : String(e)
      errorMessages.push(`❌ ${meta.name}: ${reason}`)
    }
  }

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
