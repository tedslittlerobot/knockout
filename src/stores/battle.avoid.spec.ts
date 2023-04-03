import { describe, it, expect } from 'vitest'
import { createPinia } from 'pinia'
import useBattle, { type BattleFaceOff } from './battle'
import type { Roster } from './rosters'

function faceOffNames(faceoff: BattleFaceOff) {
  return faceoff.map(item => item?.name)
}

describe('Four Person Battle with Nemeses', () => {
  const roster: Roster = {
    id: 'roster-id',
    name: 'Francesco',
    contenders: [
      { id: 'contender-a', name: 'Alison', avoid: /Brett/ },
      { id: 'contender-b', name: 'Brett', avoid: null },
      { id: 'contender-c', name: 'Caroline', avoid: null },
      { id: 'contender-d', name: 'Derek', avoid: null },
    ],
  }

  it('has adjusted face-offs, as Alison does not like Brett', () => {
    const battle = useBattle(createPinia())
    battle.begin(roster, [])

    expect(battle.rounds.length).toBe(1)

    const round = battle.rounds[0]
    expect(round.length).toBe(2)

    expect(faceOffNames(round[0])).toStrictEqual([ 'Alison', 'Caroline' ])
    expect(faceOffNames(round[1])).toStrictEqual([ 'Derek', 'Brett' ])
  })
})
