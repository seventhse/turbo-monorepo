import { versionBump } from "bumpp"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import process from "node:process"

const baseDir = process.cwd()

const packageList = ['common-ui', 'utils']
const appList = []

async function getPackage(packageDir: string) {
  const packagePath = join(packageDir, 'package.json')
  const packageFile = await readFile(packagePath, 'utf-8')
  return JSON.parse(packageFile)
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

      const msg = `✅ ${packageInfo.name}: ${res.currentVersion} → ${res.newVersion}`
      successMessages.push(msg)

    } catch (e) {
      const reason = e instanceof Error ? e.message : String(e)
      errorMessages.push(`❌ ${item}: ${reason}`)
    }
  }

  // 输出汇总
  console.log('\n\n📝 Bump Summary\n-------------------')

  if (successMessages.length) {
    console.log('\n🎉 Successful bumps:')
    successMessages.forEach(msg => console.log('\n  ' + msg))
  }

  if (errorMessages.length) {
    console.log('\n⚠️  Failed bumps:')
    errorMessages.forEach(msg => console.log('\n  ' + msg))
  }
}


tryBumppPackage()
