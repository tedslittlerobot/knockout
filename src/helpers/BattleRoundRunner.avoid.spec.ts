import { describe, it, expect } from 'vitest'
import type { BattleFaceOff } from '@/stores/battle'
import BattleRoundRunner from './BattleRoundRunner'

function faceOffNames(faceoff: BattleFaceOff) {
  return faceoff.map(item => item?.name)
}

describe('Four Person Battle with Nemeses', () => {
  const contenders = [
    { id: 'contender-a', name: 'Alison', avoid: /Brett/ },
    { id: 'contender-b', name: 'Brett', avoid: null },
    { id: 'contender-c', name: 'Caroline', avoid: null },
    { id: 'contender-d', name: 'Derek', avoid: null },
  ]

  it('has adjusted face-offs, as Alison does not like Brett', () => {
    const battle = new BattleRoundRunner(contenders)
    battle.run({})

    expect(battle.pairings.length).toBe(2)

    expect(faceOffNames(battle.pairings[0])).toStrictEqual([ 'Alison', 'Caroline' ])
    expect(faceOffNames(battle.pairings[1])).toStrictEqual([ 'Brett', 'Derek' ])
  })

  it('has adjusted and prioritised face-offs, as Brett does not like Caroline', () => {
    const battle = new BattleRoundRunner([
      { id: 'contender-a', name: 'Alison', avoid: null },
      { id: 'contender-b', name: 'Brett', avoid: /Caroline/ },
      { id: 'contender-c', name: 'Caroline', avoid: null },
      { id: 'contender-d', name: 'Derek', avoid: null },
    ])
    battle.run({})


    expect(battle.pairings.length).toBe(2)

    expect(faceOffNames(battle.pairings[0])).toStrictEqual([ 'Brett', 'Alison' ])
    expect(faceOffNames(battle.pairings[1])).toStrictEqual([ 'Caroline', 'Derek' ])
  })
})
