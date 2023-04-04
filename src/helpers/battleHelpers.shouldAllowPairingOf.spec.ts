import { describe, it, expect } from 'vitest'
import { shouldAllowPairingOf } from './battleHelpers'

describe('No Avoids', () => {
  it('Allows pairing', () => {
    const pairings = [
      { id: 'foo', name: 'Foo', avoid: null },
      { id: 'bar', name: 'Bar', avoid: null },
      { id: 'baz', name: 'Baz', avoid: null },
    ]

    expect(shouldAllowPairingOf(pairings)).toBe(true)
  })
})

describe('One-way avoids', () => {
  it('Disallows pairing when avoids are relevant', () => {
    const pairings = [
      { id: 'foo', name: 'Foo', avoid: /Bar/ },
      { id: 'bar', name: 'Bar', avoid: null },
      { id: 'baz', name: 'Baz', avoid: null },
    ]

    expect(shouldAllowPairingOf(pairings)).toBe(false)
  })

  it('Allows pairing when avoids are irrelevant', () => {
    const pairings = [
      { id: 'foo', name: 'Foo', avoid: /Monkeys/ },
      { id: 'bar', name: 'Bar', avoid: null },
      { id: 'baz', name: 'Baz', avoid: null },
    ]

    expect(shouldAllowPairingOf(pairings)).toBe(true)
  })
})

describe('Complex avoids', () => {
  it('Disallows pairing when avoids are all relevant', () => {
    const pairings = [
      { id: 'foo', name: 'Foo', avoid: /Bar/ },
      { id: 'bar', name: 'Bar', avoid: /Baz/ },
      { id: 'baz', name: 'Baz', avoid: /Foo/ },
    ]

    expect(shouldAllowPairingOf(pairings)).toBe(false)
  })

  it('Disallows pairing when one avoid is relevant', () => {
    const pairings = [
      { id: 'foo', name: 'Foo', avoid: /Bar/ },
      { id: 'bar', name: 'Bar', avoid: /Monkeys/ },
      { id: 'baz', name: 'Baz', avoid: /Mango/ },
    ]

    expect(shouldAllowPairingOf(pairings)).toBe(false)
  })

  it('Allows pairing when both avoids are irrelevant', () => {
    const pairings = [
      { id: 'foo', name: 'Foo', avoid: /Monkeys/ },
      { id: 'bar', name: 'Bar', avoid: /Nandos/ },
      { id: 'baz', name: 'Baz', avoid: /Gelatin/ },
    ]

    expect(shouldAllowPairingOf(pairings)).toBe(true)
  })
})
