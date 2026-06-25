export const uniqBy = <T, K>(items: T[], key: (item: T) => K): T[] => {
  const seen = new Set<K>()
  return items.filter((item) => {
    const k = key(item)
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}
