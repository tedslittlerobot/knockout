import { describe, it, expect } from 'vitest'
import { prioritiseContenders } from './battleHelpers'

describe('Array with no avoids', () => {
  const contenders = [
    { id: 'foo', name: 'Foo', avoid: null },
    { id: 'bar', name: 'Bar', avoid: null },
    { id: 'baz', name: 'Baz', avoid: null },
  ]

  it('Keeps the same order', () => {
    const result = prioritiseContenders(contenders)

    expect(result).toStrictEqual(contenders)
  })
})

describe('Array with avoids', () => {
  const contenders = [
    { id: 'foo', name: 'Foo', avoid: null },
    { id: 'bar', name: 'Bar', avoid: /woop/ },
    { id: 'baz', name: 'Baz', avoid: null },
  ]

  it('Prioritises entries with avoiders', () => {
    const result = prioritiseContenders(contenders)

    expect(result).toStrictEqual([ contenders[1], contenders[0], contenders[2] ])
  })
})
