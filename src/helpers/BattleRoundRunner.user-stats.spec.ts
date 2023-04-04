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

    const stats: BattleStats = {}

    battle.updateStats(stats, [
      [{ id: 'alison', name: 'Alison', avoid: null }, { id: 'brett', name: 'Brett', avoid: null }],
    ])

    const expectation: BattleStats = {
      alison: { contenderId: 'alison', rounds: [{ isComplete: true, opponents: ['brett'] }] },
      brett: { contenderId: 'brett', rounds: [{ isComplete: true, opponents: ['alison'] }] },
    }

    expect(stats).toStrictEqual(expectation)
  })

  it('two match rounds result in two user rounds', () => {
    const battle = new BattleRoundRunner(contenders)

    const stats: BattleStats = {
      alison: { contenderId: 'alison', rounds: [{ isComplete: true, opponents: ['brett'] }] },
      brett: { contenderId: 'brett', rounds: [{ isComplete: true, opponents: ['alison'] }] },
    }

    battle.updateStats(stats, [
      [{ id: 'alison', name: 'Alison', avoid: null }, { id: 'brett', name: 'Brett', avoid: null }],
    ])

    const expectation: BattleStats = {
      alison: { contenderId: 'alison', rounds: [{ isComplete: true, opponents: ['brett'] }, { isComplete: true, opponents: ['brett'] }] },
      brett: { contenderId: 'brett', rounds: [{ isComplete: true, opponents: ['alison'] }, { isComplete: true, opponents: ['alison'] }] },
    }

    expect(stats).toStrictEqual(expectation)
  })
})

describe('Four Person Battle', () => {
  const contenders = [
    { id: 'alison', name: 'Alison', avoid: null },
    { id: 'brett', name: 'Brett', avoid: null },
    { id: 'caroline', name: 'Caroline', avoid: null },
    { id: 'derek', name: 'Derek', avoid: null },
  ]

  it('evaluates with one (first) round', () => {
    const battle = new BattleRoundRunner(contenders)

    const stats: BattleStats = {}

    battle.updateStats(stats, [
      [{ id: 'alison', name: 'Alison', avoid: null }, { id: 'brett', name: 'Brett', avoid: null }],
      [{ id: 'caroline', name: 'Caroline', avoid: null }, { id: 'derek', name: 'Derek', avoid: null }],
    ])

    const expectation: BattleStats = {
      alison: { contenderId: 'alison', rounds: [{ isComplete: false, opponents: ['brett'] }] },
      brett: { contenderId: 'brett', rounds: [{ isComplete: false, opponents: ['alison'] }] },
      caroline: { contenderId: 'caroline', rounds: [{ isComplete: false, opponents: ['derek'] }] },
      derek: { contenderId: 'derek', rounds: [{ isComplete: false, opponents: ['caroline'] }] },
    }

    expect(stats).toStrictEqual(expectation)
  })

  it('evaluates with two rounds', () => {
    const battle = new BattleRoundRunner(contenders)

    const stats: BattleStats = {
      alison: { contenderId: 'alison', rounds: [{ isComplete: false, opponents: ['brett'] }] },
      brett: { contenderId: 'brett', rounds: [{ isComplete: false, opponents: ['alison'] }] },
      caroline: { contenderId: 'caroline', rounds: [{ isComplete: false, opponents: ['derek'] }] },
      derek: { contenderId: 'derek', rounds: [{ isComplete: false, opponents: ['caroline'] }] },
    }

    battle.updateStats(stats, [
      [{ id: 'alison', name: 'Alison', avoid: null }, { id: 'caroline', name: 'Caroline', avoid: null }],
      [{ id: 'brett', name: 'Brett', avoid: null }, { id: 'derek', name: 'Derek', avoid: null }],
    ])

    const expectation: BattleStats = {
      alison: { contenderId: 'alison', rounds: [{ isComplete: false, opponents: ['brett', 'caroline'] }] },
      brett: { contenderId: 'brett', rounds: [{ isComplete: false, opponents: ['alison', 'derek'] }] },
      caroline: { contenderId: 'caroline', rounds: [{ isComplete: false, opponents: ['derek', 'alison'] }] },
      derek: { contenderId: 'derek', rounds: [{ isComplete: false, opponents: ['caroline', 'brett'] }] },
    }

    expect(stats).toStrictEqual(expectation)
  })

  it('evaluates with three rounds', () => {
    const battle = new BattleRoundRunner(contenders)

    const stats: BattleStats = {
      alison: { contenderId: 'alison', rounds: [{ isComplete: false, opponents: ['brett', 'caroline'] }] },
      brett: { contenderId: 'brett', rounds: [{ isComplete: false, opponents: ['alison', 'derek'] }] },
      caroline: { contenderId: 'caroline', rounds: [{ isComplete: false, opponents: ['derek', 'alison'] }] },
      derek: { contenderId: 'derek', rounds: [{ isComplete: false, opponents: ['caroline', 'brett'] }] },
    }

    battle.updateStats(stats, [
      [{ id: 'alison', name: 'Alison', avoid: null }, { id: 'derek', name: 'Derek', avoid: null }],
      [{ id: 'brett', name: 'Brett', avoid: null }, { id: 'caroline', name: 'Caroline', avoid: null }],
    ])

    const expectation: BattleStats = {
      alison: { contenderId: 'alison', rounds: [{ isComplete: true, opponents: ['brett', 'caroline', 'derek'] }] },
      brett: { contenderId: 'brett', rounds: [{ isComplete: true, opponents: ['alison', 'derek', 'caroline'] }] },
      caroline: { contenderId: 'caroline', rounds: [{ isComplete: true, opponents: ['derek', 'alison', 'brett'] }] },
      derek: { contenderId: 'derek', rounds: [{ isComplete: true, opponents: ['caroline', 'brett', 'alison'] }] },
    }

    expect(stats).toStrictEqual(expectation)
  })

  it('evaluates with four rounds', () => {
    const battle = new BattleRoundRunner(contenders)

    const stats: BattleStats = {
      alison: { contenderId: 'alison', rounds: [{ isComplete: true, opponents: ['brett', 'caroline', 'derek'] }] },
      brett: { contenderId: 'brett', rounds: [{ isComplete: true, opponents: ['alison', 'derek', 'caroline'] }] },
      caroline: { contenderId: 'caroline', rounds: [{ isComplete: true, opponents: ['derek', 'alison', 'brett'] }] },
      derek: { contenderId: 'derek', rounds: [{ isComplete: true, opponents: ['caroline', 'brett', 'alison'] }] },
    }

    battle.updateStats(stats, [
      [{ id: 'alison', name: 'Alison', avoid: null }, { id: 'brett', name: 'Brett', avoid: null }],
      [{ id: 'caroline', name: 'Caroline', avoid: null }, { id: 'derek', name: 'Derek', avoid: null }],
    ])

    const expectation: BattleStats = {
      alison: { contenderId: 'alison', rounds: [{ isComplete: true, opponents: ['brett', 'caroline', 'derek'] }, { isComplete: false, opponents: ['brett'] }] },
      brett: { contenderId: 'brett', rounds: [{ isComplete: true, opponents: ['alison', 'derek', 'caroline'] }, { isComplete: false, opponents: ['alison'] }] },
      caroline: { contenderId: 'caroline', rounds: [{ isComplete: true, opponents: ['derek', 'alison', 'brett'] }, { isComplete: false, opponents: ['derek'] }] },
      derek: { contenderId: 'derek', rounds: [{ isComplete: true, opponents: ['caroline', 'brett', 'alison'] }, { isComplete: false, opponents: ['caroline'] }] },
    }

    expect(stats).toStrictEqual(expectation)
  })
})
