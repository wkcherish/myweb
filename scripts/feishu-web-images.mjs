#!/usr/bin/env node

import { createHash } from 'node:crypto'
import { createWriteStream } from 'node:fs'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { basename, dirname, extname, isAbsolute, join, relative, resolve } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const defaultOptions = {
  source: 'content/wiki',
  out: 'public/images/feishu',
  publicPrefix: '/images/feishu/assets',
  concurrency: 4,
  force: false,
  skipExisting: false,
}

const imageMarkdownPattern = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g
const imageHtmlPattern = /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi
const fileDatePattern = /(?:^|\/)(\d{4}-\d{2}-\d{2})-[^/]+\.md$/i

const args = parseArgs(process.argv.slice(2))
const options = {
  ...defaultOptions,
  source: args.source || args.src || defaultOptions.source,
  out: args.out || defaultOptions.out,
  publicPrefix: args.publicPrefix || defaultOptions.publicPrefix,
  concurrency: Number(args.concurrency || defaultOptions.concurrency),
  force: Boolean(args.force),
  skipExisting: Boolean(args.skipExisting || args.skip),
  files: normalizeArgList(args.file || args.files).concat(args._),
}

await main()

async function main() {
  const startedAt = new Date()
  const markdownFiles = await listMarkdownFiles(options.source, options.files)
  const previousManifest = await readManifest(join(options.out, 'manifest.json'))
  const previousByUrl = new Map(
    previousManifest.images
      .filter((image) => image.originalUrl)
      .map((image) => [image.originalUrl, image]),
  )
  const imageRecords = []

  for (const filePath of markdownFiles) {
    const markdown = await readFile(filePath, 'utf8')
    const doc = getDocumentInfo(filePath, markdown, options.source)
    const images = extractImages(markdown)
    const remoteUrls = images.filter((image) => isRemoteImage(image.url)).map((image) => image.url)

    if (options.skipExisting && remoteUrls.length > 0 &&
        remoteUrls.every((url) => {
          const prev = previousByUrl.get(url)
          return prev && (prev.status === 'downloaded' || prev.status === 'exists')
        })) {
      continue
    }

    images.forEach((image, index) => {
      if (!isRemoteImage(image.url)) {
        return
      }

      const ext = getExtensionFromUrl(image.url)
      const filename = `${doc.createdAt}-${doc.id}-${String(index + 1).padStart(3, '0')}${ext}`
      const previous = previousByUrl.get(image.url)
      const localFile = previous?.localFile || join(options.out, 'assets', filename)
      const recordFilename = previous?.filename || filename
      const publicPath = previous?.publicPath || `${options.publicPrefix}/${recordFilename}`

      imageRecords.push({
        ...previous,
        docTitle: doc.title,
        docId: doc.id,
        docCreatedAt: doc.createdAt,
        markdownFile: normalizePath(filePath),
        sourceType: image.type,
        alt: image.alt,
        originalUrl: image.url,
        localFile: normalizePath(localFile),
        publicPath,
        filename: recordFilename,
      })
    })
  }

  await mkdir(join(options.out, 'assets'), { recursive: true })
  await downloadAll(imageRecords)

  const mergedImages = mergeManifestImages(previousManifest.images, imageRecords)

  const manifest = {
    generatedAt: startedAt.toISOString(),
    source: normalizePath(options.source),
    files: options.files.map(normalizePath),
    outputDir: normalizePath(options.out),
    publicPrefix: options.publicPrefix,
    count: mergedImages.length,
    images: mergedImages,
  }

  const manifestPath = join(options.out, 'manifest.json')
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

  const zipPath = await createZip(options.out, startedAt)

  console.log(`扫描 Markdown：${markdownFiles.length} 个文件`)
  console.log(`发现远程图片：${imageRecords.length} 张`)
  console.log(`图片目录：${join(options.out, 'assets')}`)
  console.log(`图片清单：${manifestPath}`)
  console.log(zipPath ? `压缩包：${zipPath}` : '压缩包：未生成，当前系统没有 zip 命令')
}

function mergeManifestImages(previousImages, currentImages) {
  const merged = new Map()

  for (const image of previousImages) {
    if (image.originalUrl) {
      merged.set(image.originalUrl, image)
    }
  }

  for (const image of currentImages) {
    merged.set(image.originalUrl, image)
  }

  return Array.from(merged.values())
}

async function downloadAll(records) {
  let cursor = 0
  const workers = Array.from({ length: Math.max(1, options.concurrency) }, async () => {
    while (cursor < records.length) {
      const index = cursor
      cursor += 1
      await downloadImage(records[index])
    }
  })

  await Promise.all(workers)
}

async function downloadImage(record) {
  if (!options.force && await exists(record.localFile)) {
    record.status = 'exists'
    return
  }

  try {
    const response = await fetch(record.originalUrl, {
      redirect: 'follow',
      headers: {
        'user-agent': 'notebook-feishu-image-migrator/1.0',
      },
    })

    if (!response.ok || !response.body) {
      throw new Error(`HTTP ${response.status}`)
    }

    await mkdir(dirname(record.localFile), { recursive: true })
    await pipeline(response.body, createWriteStream(record.localFile))
    record.status = 'downloaded'
    record.contentType = response.headers.get('content-type') || ''
  } catch (error) {
    record.status = 'failed'
    record.error = error instanceof Error ? error.message : String(error)
  }
}

async function readManifest(path) {
  try {
    const manifest = JSON.parse(await readFile(path, 'utf8'))
    return {
      ...manifest,
      images: Array.isArray(manifest.images) ? manifest.images : [],
    }
  } catch {
    return { images: [] }
  }
}

async function createZip(outDir, startedAt) {
  const stamp = formatStamp(startedAt)
  const zipPath = join(outDir, `feishu-images-${stamp}.zip`)

  try {
    await execFileAsync('zip', ['-qr', basename(zipPath), 'assets', 'manifest.json'], { cwd: outDir })
    return zipPath
  } catch {
    return ''
  }
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

function extractImages(markdown) {
  const images = []

  for (const match of markdown.matchAll(imageMarkdownPattern)) {
    images.push({ type: 'markdown', alt: match[1] || '', url: decodeMarkdownUrl(match[2]) })
  }

  for (const match of markdown.matchAll(imageHtmlPattern)) {
    images.push({ type: 'html', alt: '', url: match[1] })
  }

  return dedupeImages(images)
}

function dedupeImages(images) {
  const seen = new Set()
  return images.filter((image) => {
    const key = `${image.type}:${image.url}`
    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

function getDocumentInfo(filePath, markdown, sourceRoot) {
  const frontmatter = parseFrontmatter(markdown)
  const relativePath = normalizePath(relative(sourceRoot, filePath))
  const dateFromFilename = normalizePath(filePath).match(fileDatePattern)?.[1]
  const createdAt = normalizeDate(frontmatter.createdAt || frontmatter.date || dateFromFilename)
  const id = sanitizeId(frontmatter.feishuId || frontmatter.id || basename(filePath, extname(filePath)))

  return {
    title: frontmatter.title || basename(filePath, extname(filePath)),
    id,
    createdAt,
    relativePath,
  }
}

function parseFrontmatter(markdown) {
  if (!markdown.startsWith('---')) {
    return {}
  }

  const endIndex = markdown.indexOf('\n---', 3)
  if (endIndex === -1) {
    return {}
  }

  const block = markdown.slice(3, endIndex).trim()
  const result = {}

  for (const line of block.split('\n')) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!match) {
      continue
    }

    result[match[1]] = match[2].trim().replace(/^["']|["']$/g, '')
  }

  return result
}

function normalizeDate(value) {
  if (!value) {
    return 'undated'
  }

  const text = String(value).trim()
  const match = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/)

  if (!match) {
    return 'undated'
  }

  return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`
}

function sanitizeId(value) {
  const raw = String(value || 'note').trim()
  const safe = raw
    .replace(/\.md$/i, '')
    .replace(/^\d{4}-\d{2}-\d{2}-/, '')
    .replace(/[^\p{L}\p{N}_-]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

  return safe || createHash('sha1').update(raw).digest('hex').slice(0, 10)
}

function getExtensionFromUrl(url) {
  const cleanUrl = url.split('?')[0].split('#')[0]
  const ext = extname(cleanUrl).toLowerCase()
  const allowed = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg'])

  return allowed.has(ext) ? ext : '.png'
}

function isRemoteImage(url) {
  return /^https?:\/\//i.test(url)
}

function decodeMarkdownUrl(url) {
  return url.replace(/^<|>$/g, '')
}

function normalizePath(path) {
  return path.replaceAll('\\', '/')
}

function parseArgs(argv) {
  const parsed = { _: [] }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (!arg.startsWith('--')) {
      parsed._.push(arg)
      continue
    }

    const [key, inlineValue] = arg.slice(2).split('=')
    const next = argv[index + 1]

    if (inlineValue !== undefined) {
      addArgValue(parsed, key, inlineValue)
    } else if (next && !next.startsWith('--')) {
      addArgValue(parsed, key, next)
      index += 1
    } else {
      addArgValue(parsed, key, true)
    }
  }

  return parsed
}

function addArgValue(parsed, key, value) {
  if (parsed[key] === undefined) {
    parsed[key] = value
    return
  }

  parsed[key] = normalizeArgList(parsed[key]).concat(value)
}

function normalizeArgList(value) {
  if (value === undefined || value === false) {
    return []
  }

  return Array.isArray(value) ? value.flatMap(normalizeArgList) : String(value).split(',').filter(Boolean)
}

async function exists(path) {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

function formatStamp(date) {
  const pad = (value) => String(value).padStart(2, '0')
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    '-',
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join('')
}
