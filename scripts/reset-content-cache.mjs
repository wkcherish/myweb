import { existsSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const targets = ['.data/content']

for (const target of targets) {
  const absolutePath = resolve(process.cwd(), target)

  if (!existsSync(absolutePath)) {
    continue
  }

  rmSync(absolutePath, { recursive: true, force: true })
  console.log(`[content-cache] removed ${target}`)
}
