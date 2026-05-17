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

declare module 'node:process' {
  export const env: Record<string, string | undefined>
  export function cwd(): string
}

declare const process: {
  cwd(): string
  env: Record<string, string | undefined>
}
