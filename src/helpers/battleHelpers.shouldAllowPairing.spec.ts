import { describe, it, expect } from 'vitest'
import { shouldAllowPairing } from './battleHelpers'

describe('No Avoids', () => {
  it('Allows pairing', () => {
    const redTeam = { id: 'foo', name: 'Foo', avoid: null }
    const blueTeam = { id: 'bar', name: 'Bar', avoid: null }

    expect(shouldAllowPairing(redTeam, blueTeam)).toBe(true)
    expect(shouldAllowPairing(blueTeam, redTeam)).toBe(true)
  })
})

describe('One-way avoids', () => {
  it('Disallows pairing when avoids are relevant', () => {
    const redTeam = { id: 'foo', name: 'Foo', avoid: /Bar/ }
    const blueTeam = { id: 'bar', name: 'Bar', avoid: null }

    expect(shouldAllowPairing(redTeam, blueTeam)).toBe(false)
    expect(shouldAllowPairing(blueTeam, redTeam)).toBe(false)
  })

  it('Allows pairing when avoids are irrelevant', () => {
    const redTeam = { id: 'foo', name: 'Foo', avoid: /Monkeys/ }
    const blueTeam = { id: 'bar', name: 'Bar', avoid: null }

    expect(shouldAllowPairing(redTeam, blueTeam)).toBe(true)
    expect(shouldAllowPairing(blueTeam, redTeam)).toBe(true)
  })
})

describe('Two-way avoids', () => {
  it('Disallows pairing when avoids are both relevant', () => {
    const redTeam = { id: 'foo', name: 'Foo', avoid: /Bar/ }
    const blueTeam = { id: 'bar', name: 'Bar', avoid: /Foo/ }

    expect(shouldAllowPairing(redTeam, blueTeam)).toBe(false)
    expect(shouldAllowPairing(blueTeam, redTeam)).toBe(false)
  })

  it('Disallows pairing when one avoid is relevant', () => {
    const redTeam = { id: 'foo', name: 'Foo', avoid: /Bar/ }
    const blueTeam = { id: 'bar', name: 'Bar', avoid: /Monkeys/ }

    expect(shouldAllowPairing(redTeam, blueTeam)).toBe(false)
    expect(shouldAllowPairing(blueTeam, redTeam)).toBe(false)
  })

  it('Allows pairing when both avoids are irrelevant', () => {
    const redTeam = { id: 'foo', name: 'Foo', avoid: /Monkeys/ }
    const blueTeam = { id: 'bar', name: 'Bar', avoid: /Monkeys/ }

    expect(shouldAllowPairing(redTeam, blueTeam)).toBe(true)
    expect(shouldAllowPairing(blueTeam, redTeam)).toBe(true)
  })
})
