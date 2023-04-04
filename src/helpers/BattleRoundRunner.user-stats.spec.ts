import { describe, it, expect } from 'vitest'
import type { BattleStats } from '@/stores/battle'
import BattleRoundRunner from './BattleRoundRunner'

describe('Two Person Simple Battle', () => {
  const contenders = [
    { id: 'alison', name: 'Alison', avoid: null },
    { id: 'brett', name: 'Brett', avoid: null },
  ]

  it('has a single face-off', () => {
    const battle = new BattleRoundRunner(contenders)
    battle.run()

    const stats: BattleStats = {}

    battle.updateStats(stats)

    const expectation: BattleStats = {
      alison: { contenderId: 'alison', rounds: [{ isComplete: true, opponents: ['brett'] }] },
      brett: { contenderId: 'brett', rounds: [{ isComplete: true, opponents: ['alison'] }] },
    }

    expect(stats).toStrictEqual(expectation)
  })
})
