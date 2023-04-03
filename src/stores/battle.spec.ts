import { describe, it, expect } from 'vitest'
import { createPinia } from 'pinia'
import useBattle, { type BattleFaceOff } from './battle'
import type { Roster } from './rosters'

function faceOffNames(faceoff: BattleFaceOff) {
  return faceoff.map(item => item?.name)
}

describe('Two Person Battle', () => {
  const roster: Roster = {
    id: 'roster-id',
    name: 'Tina',
    contenders: [
      { id: 'contender-a', name: 'Alison', avoid: null },
      { id: 'contender-b', name: 'Brett', avoid: null },
    ],
  }

  it('has a single face-off', () => {
    const battle = useBattle(createPinia())
    battle.begin(roster, [])

    expect(battle.rounds.length).toBe(1)

    expect(faceOffNames(battle.rounds[0][0])).toStrictEqual([ 'Alison', 'Brett' ])
  })
})

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

  it('has a first round of a three way', () => {
    const battle = useBattle(createPinia())
    battle.begin(roster, [])

    expect(battle.rounds.length).toBe(1)

    expect(faceOffNames(battle.rounds[0][0])).toStrictEqual([ 'Alison', 'Brett', 'Caroline' ])
  })

  it('has a two way when one is excluded', () => {
    const battle = useBattle(createPinia())
    battle.begin(roster, ['contender-b'])

    expect(battle.rounds.length).toBe(1)

    expect(faceOffNames(battle.rounds[0][0])).toStrictEqual([ 'Alison', 'Caroline' ])
  })
})

describe('Four Person Battle', () => {
  const roster: Roster = {
    id: 'roster-id',
    name: 'Frankie',
    contenders: [
      { id: 'contender-a', name: 'Alison', avoid: null },
      { id: 'contender-b', name: 'Brett', avoid: null },
      { id: 'contender-c', name: 'Caroline', avoid: null },
      { id: 'contender-d', name: 'Derek', avoid: null },
    ],
  }

  it('has two face-offs', () => {
    const battle = useBattle(createPinia())
    battle.begin(roster, [])

    expect(battle.rounds.length).toBe(1)

    const round = battle.rounds[0]
    expect(round.length).toBe(2)

    expect(faceOffNames(round[0])).toStrictEqual([ 'Alison', 'Brett' ])
    expect(faceOffNames(round[1])).toStrictEqual([ 'Caroline', 'Derek' ])
  })
})
