import { describe, it, expect } from 'vitest'
import type { BattleFaceOff } from '@/stores/battle'
import BattleRoundRunner from './BattleRoundRunner'

function faceOffNames(faceoff: BattleFaceOff) {
  return faceoff.map(item => item?.name)
}

describe('Two Person Battle', () => {
  const contenders = [
    { id: 'contender-a', name: 'Alison', avoid: null },
    { id: 'contender-b', name: 'Brett', avoid: null },
  ]

  it('has a single face-off', () => {
    const battle = new BattleRoundRunner(contenders)
    battle.run()

    expect(battle.pairings.length).toBe(1)

    expect(faceOffNames(battle.pairings[0])).toStrictEqual([ 'Alison', 'Brett' ])
  })
})

describe('Three Person Battle', () => {
  const contenders = [
    { id: 'contender-a', name: 'Alison', avoid: null },
    { id: 'contender-b', name: 'Brett', avoid: null },
    { id: 'contender-c', name: 'Caroline', avoid: null },
  ]

  it('has a first round of a three way', () => {
    const battle = new BattleRoundRunner(contenders)
    battle.run()

    expect(battle.pairings.length).toBe(1)

    expect(faceOffNames(battle.pairings[0])).toStrictEqual([ 'Alison', 'Brett', 'Caroline' ])
  })
})

describe('Four Person Battle', () => {
  const contenders = [
    { id: 'contender-a', name: 'Alison', avoid: null },
    { id: 'contender-b', name: 'Brett', avoid: null },
    { id: 'contender-c', name: 'Caroline', avoid: null },
    { id: 'contender-d', name: 'Derek', avoid: null },
  ]

  it('has two face-offs', () => {
    const battle = new BattleRoundRunner(contenders)
    battle.run()

    expect(battle.pairings.length).toBe(2)

    expect(faceOffNames(battle.pairings[0])).toStrictEqual([ 'Alison', 'Brett' ])
    expect(faceOffNames(battle.pairings[1])).toStrictEqual([ 'Caroline', 'Derek' ])
  })
})
