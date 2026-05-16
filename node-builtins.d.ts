declare module 'node:fs' {
  interface Dirent {
    name: string
    isFile(): boolean
  }

  interface ReaddirWithFileTypesOptions {
    withFileTypes: true
  }

  export function existsSync(path: string): boolean
  export function readdirSync(path: string, options: ReaddirWithFileTypesOptions): Dirent[]
}

declare module 'node:path' {
  export function extname(path: string): string
  export function parse(path: string): { name: string }
  export function resolve(...paths: string[]): string
}

declare const process: {
  cwd(): string
}
