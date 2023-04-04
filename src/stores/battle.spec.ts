import { describe, it, expect } from 'vitest'
import { createPinia } from 'pinia'
import useBattle, { type BattleFaceOff } from './battle'
import type { Roster } from './rosters'

function faceOffNames(faceoff: BattleFaceOff) {
  return faceoff.map(item => item?.name)
}

describe('Three Person Battle', () => {
  const roster: Roster = {
    id: 'roster-id',
    name: 'Justin',
    contenders: [
      { id: 'contender-a', name: 'Alison', avoid: null },
      { id: 'contender-b', name: 'Brett', avoid: null },
      { id: 'contender-c', name: 'Caroline', avoid: null },
    ],
  }

  it('has a two way when one is excluded', () => {
    const battle = useBattle(createPinia())
    battle.begin(roster, ['contender-b'])

    expect(battle.rounds.length).toBe(1)

    expect(faceOffNames(battle.rounds[0][0])).toStrictEqual([ 'Alison', 'Caroline' ])
  })
})
