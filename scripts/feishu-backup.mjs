#!/usr/bin/env node

import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'

const command = process.argv[2] || 'rewrite'
const args = parseArgs(process.argv.slice(3))

const options = {
  source: args.source || args.src || 'content/wiki',
  out: args.out || 'feishu-images/markdown',
  manifest: args.manifest || 'feishu-images/manifest.json',
  cloudMap: args.cloudMap || '',
  inPlace: Boolean(args.inPlace),
}

if (command !== 'rewrite') {
  console.error(`未知命令：${command}`)
  console.error('可用命令：rewrite')
  process.exit(1)
}

await rewriteMarkdown()

async function rewriteMarkdown() {
  const manifest = JSON.parse(await readFile(options.manifest, 'utf8'))
  const cloudMap = options.cloudMap ? JSON.parse(await readFile(options.cloudMap, 'utf8')) : {}
  const replacements = buildReplacements(manifest, cloudMap)
  const markdownFiles = await listMarkdownFiles(options.source)
  let changedCount = 0

  for (const filePath of markdownFiles) {
    const original = await readFile(filePath, 'utf8')
    let next = original

    for (const [from, to] of replacements) {
      next = next.split(from).join(to)
    }

    if (next === original) {
      continue
    }

    const outputPath = options.inPlace
      ? filePath
      : join(options.out, relative(options.source, filePath))

    await mkdir(dirname(outputPath), { recursive: true })
    await writeFile(outputPath, next)
    changedCount += 1
  }

  console.log(`扫描 Markdown：${markdownFiles.length} 个文件`)
  console.log(`完成替换：${changedCount} 个文件`)
  console.log(options.inPlace ? `写回目录：${options.source}` : `输出目录：${options.out}`)
}

function buildReplacements(manifest, cloudMap) {
  return manifest.images
    .filter((image) => image.originalUrl && image.publicPath)
    .map((image) => {
      const cloudUrl = cloudMap[image.publicPath] || cloudMap[image.filename] || cloudMap[image.originalUrl]
      return [image.originalUrl, cloudUrl || image.publicPath]
    })
}

async function listMarkdownFiles(root) {
  const output = []

  async function walk(current) {
    const currentStat = await stat(current)
    if (currentStat.isFile() && current.endsWith('.md')) {
      output.push(current)
      return
    }

    if (!currentStat.isDirectory()) {
      return
    }

    const { readdir } = await import('node:fs/promises')
    const entries = await readdir(current, { withFileTypes: true })

    for (const entry of entries) {
      await walk(join(current, entry.name))
    }
  }

  await walk(root)
  return output.sort()
}

function parseArgs(argv) {
  const parsed = {}

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (!arg.startsWith('--')) {
      continue
    }

    const [key, inlineValue] = arg.slice(2).split('=')
    const next = argv[index + 1]

    if (inlineValue !== undefined) {
      parsed[key] = inlineValue
    } else if (next && !next.startsWith('--')) {
      parsed[key] = next
      index += 1
    } else {
      parsed[key] = true
    }
  }

  return parsed
}
