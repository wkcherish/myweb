type ReadonlySetWithHas<T> = Pick<ReadonlySet<T>, 'has'>

export default defineNitroPlugin(() => {
  if (typeof Set.prototype.difference === 'function') {
    return
  }

  Object.defineProperty(Set.prototype, 'difference', {
    configurable: true,
    writable: true,
    value: function difference<T>(this: Set<T>, other: ReadonlySetWithHas<T>) {
      const result = new Set<T>()

      for (const value of this) {
        if (!other.has(value)) {
          result.add(value)
        }
      }

      return result
    },
  })
})
