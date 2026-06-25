import { describe, expect, it } from 'vitest'

import { uniqBy } from './uniqBy'

describe('uniqBy', () => {
  it('returns an empty array when given an empty array', () => {
    expect(uniqBy<{ id: string }, string>([], (item) => item.id)).toEqual([])
  })

  it('returns the same items in the same order when there are no duplicates', () => {
    const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
    expect(uniqBy(items, (item) => item.id)).toEqual(items)
  })

  it('keeps the first occurrence and drops later duplicates', () => {
    const a = { id: 'a', value: 1 }
    const b = { id: 'b', value: 1 }
    const aDup = { id: 'a', value: 2 }
    expect(uniqBy([a, b, aDup], (item) => item.id)).toEqual([a, b])
  })

  it('returns a single item when every item shares the same key', () => {
    const items = [{ id: 'a' }, { id: 'a' }, { id: 'a' }]
    expect(uniqBy(items, (item) => item.id)).toEqual([{ id: 'a' }])
  })

  it('preserves the order of first occurrences', () => {
    const items = [{ id: 'c' }, { id: 'a' }, { id: 'b' }, { id: 'a' }, { id: 'c' }]
    expect(uniqBy(items, (item) => item.id)).toEqual([{ id: 'c' }, { id: 'a' }, { id: 'b' }])
  })

  it('does not mutate the input array', () => {
    const items = [{ id: 'a' }, { id: 'a' }, { id: 'b' }]
    const snapshot = items.map((item) => ({ ...item }))
    uniqBy(items, (item) => item.id)
    expect(items).toEqual(snapshot)
  })

  it('works with derived (non-id) keys', () => {
    const items = [
      { name: 'a', group: 1 },
      { name: 'b', group: 2 },
      { name: 'c', group: 1 },
    ]
    expect(uniqBy(items, (item) => item.group)).toEqual([
      { name: 'a', group: 1 },
      { name: 'b', group: 2 },
    ])
  })

  it('works with primitive numeric keys', () => {
    expect(uniqBy([1, 2, 1, 3, 2], (n) => n)).toEqual([1, 2, 3])
  })

  it('works with serialized composite keys', () => {
    const items = [
      { id: 'a', color: 'red' },
      { id: 'a', color: 'blue' },
      { id: 'a', color: 'red' },
      { id: 'b', color: 'red' },
    ]
    const result = uniqBy(items, (item) => `${item.id}|${item.color}`)
    expect(result).toEqual([
      { id: 'a', color: 'red' },
      { id: 'a', color: 'blue' },
      { id: 'b', color: 'red' },
    ])
  })

  it('compares object keys by reference (Set semantics)', () => {
    const shared = { tag: 'dup' }
    const a = { id: 'a', meta: shared }
    const b = { id: 'a', meta: { tag: 'dup' } }
    const result = uniqBy([a, b], (item) => item.meta)
    expect(result).toEqual([a, b])
  })
})
