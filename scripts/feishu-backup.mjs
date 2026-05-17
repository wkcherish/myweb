#!/usr/bin/env node

import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { basename, dirname, extname, isAbsolute, join, relative, resolve } from 'node:path'

const command = process.argv[2] || 'rewrite'
const args = parseArgs(process.argv.slice(3))

const options = {
  source: args.source || args.src || 'content/wiki',
  out: args.out || 'feishu-images/markdown',
  manifest: args.manifest || 'public/images/feishu/manifest.json',
  cloudMap: args.cloudMap || '',
  inPlace: Boolean(args.inPlace),
  skipExisting: Boolean(args.skipExisting || args.skip),
  files: normalizeArgList(args.file || args.files),
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
  const markdownFiles = await listMarkdownFiles(options.source, options.files)
  let changedCount = 0

  for (const filePath of markdownFiles) {
    const outputPath = options.inPlace
      ? filePath
      : join(options.out, relative(options.source, filePath))

    if (options.skipExisting && !options.inPlace) {
      try {
        await stat(outputPath)
        continue
      } catch {}
    }

    const original = await readFile(filePath, 'utf8')
    const replacements = buildReplacements(manifest, cloudMap, filePath)
    let next = original

    for (const [from, to] of replacements) {
      next = next.split(from).join(to)
    }

    if (next === original) {
      continue
    }

    await mkdir(dirname(outputPath), { recursive: true })
    await writeFile(outputPath, next)
    changedCount += 1
  }

  console.log(`扫描 Markdown：${markdownFiles.length} 个文件`)
  console.log(`完成替换：${changedCount} 个文件`)
  console.log(options.inPlace ? `写回目录：${options.source}` : `输出目录：${options.out}`)
}

function buildReplacements(manifest, cloudMap, markdownPath) {
  const markdownDir = dirname(markdownPath)
  const pairs = []

  for (const image of manifest.images) {
    if (!image.localFile) {
      continue
    }

    const cloudUrl = cloudMap[image.publicPath] || cloudMap[image.filename] || cloudMap[image.originalUrl]
    const target = cloudUrl || normalizePath(relative(markdownDir, image.localFile))

    if (image.originalUrl) {
      pairs.push([image.originalUrl, target])
    }

    if (image.publicPath && image.publicPath !== target) {
      pairs.push([image.publicPath, target])
    }
  }

  return pairs
}

async function listMarkdownFiles(root, selectedFiles = []) {
  if (selectedFiles.length > 0) {
    const files = selectedFiles.map((file) => resolveFilePath(root, file))
    const output = []

    for (const file of files) {
      let currentStat
      try {
        currentStat = await stat(file)
      } catch {
        throw new Error(`文件不存在：${file}`)
      }

      if (!currentStat.isFile() || !file.endsWith('.md')) {
        throw new Error(`只能选择 Markdown 文件：${file}`)
      }

      output.push(file)
    }

    return Array.from(new Set(output)).sort()
  }

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

function resolveFilePath(root, file) {
  if (isAbsolute(file)) {
    return file
  }

  const fromCwd = resolve(file)
  if (file.startsWith(`${root}/`) || file === root) {
    return fromCwd
  }

  return resolve(root, file)
}

function normalizeArgList(value) {
  if (value === undefined || value === false) {
    return []
  }

  return Array.isArray(value) ? value.flatMap(normalizeArgList) : String(value).split(',').filter(Boolean)
}

function normalizePath(path) {
  return path.replaceAll('\\', '/')
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
