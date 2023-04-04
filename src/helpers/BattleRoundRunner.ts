import type { Contender } from "@/stores/rosters";
import { prioritiseContenders, shouldAllowPairingOf, shouldAllowPairingOfPair } from './battleHelpers'
import LoopingContenderIterator from "./LoopingContenderIterator";
import type { BattleRound, BattleStats, BattleUserRound, BattleUserStats } from "@/stores/battle";

export default class BattleRoundRunner {
  #contenders: Contender[]
  #iterator: LoopingContenderIterator
  pairings: BattleRound = []

  #remainingSafeIterations = 1000

  constructor(source: Contender[]) {
    this.#contenders = source
    this.#iterator = new LoopingContenderIterator(prioritiseContenders(source))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  #debug(message: string, data?: any) {
    // console.info(message, data)
  }

  run(stats: BattleStats) {
    while (this.#iterator.size > 0) {
      this.#remainingSafeIterations--

      if (this.#remainingSafeIterations <= 0) {
        throw Error('Infinite or unsafe loop detected')
      }

      const incumbant = this.#iterator.startFromBeginning().yank()

      if (!incumbant) {
        console.error('Somehow has managed to start a loop against an empty iterator, which should be impossible')
        break;
      }

      // if there is one left over, they go in a random three
      if (!this.#iterator.isEmpty) {
        this.assignChallenger(incumbant, stats)
      } else {
        this.assignThreesome(incumbant, stats)
      }

      this.#debug('End of Loop', this)
    }
  }

  findChallenger(target: Contender, stats: BattleStats): Contender | null {
    this.#debug('attempting to find challenger for', target)

    const targetStats = stats[target.id]
    const previousRounds = targetStats ? targetStats.rounds : []

    const idealMatch = previousRounds.filter(round => !round.isComplete)
      .map(({ opponents }) => opponents)
      .reduce<Contender|null>((found, opponents) => {
        if (found) { return found }

        this.#debug('    Checking for opponents not faught in round', opponents)

        const perfectMatch = this.#iterator.startFromBeginning().find(candidate => {
          return shouldAllowPairingOfPair(target, candidate) && !opponents.includes(candidate.id)
        }, true)

        if (perfectMatch) {
          return perfectMatch
        }

        return null
      }, null)

    if (idealMatch) {
      return idealMatch
    }

    // just find anyone!
    const imperfectMatch = this.#iterator.startFromBeginning().find(candidate => {
      return shouldAllowPairingOfPair(target, candidate)
    }, true)

    if (imperfectMatch) {
      return imperfectMatch
    }

    return null
  }

  assignChallenger(incumbant: Contender, stats: BattleStats) {
    const challenger = this.findChallenger(incumbant, stats)

    this.#debug('found challenger', challenger)

    if (!challenger) {
      throw Error('Cannot find a challenger')
    }

    this.pairings.push([ incumbant, challenger ])
  }

  // @todo - handle previous rounds in threesomes
  assignThreesome(thirdWheel: Contender, stats: BattleStats) {
    const allowedPairings = this.pairings.filter((pairing) => {
      return shouldAllowPairingOf([thirdWheel, ...(pairing as Contender[])])
    })

    const perfectMatch = allowedPairings.findIndex(([first, second]) => {
      // check against stats to find an allowed pairing that also haven't been paired up yet
      return true
    })

    if (perfectMatch !== -1) {
      this.pairings[perfectMatch].push(thirdWheel)
    }
  }

  updateStats(stats: BattleStats, forPairings?: BattleRound) {
    this.#debug('Updating stats')

    const pairings = (forPairings || this.pairings)
    pairings.forEach(pairing => {
      this.#debug('Stats for Pairing', pairing)
      // takes a pairing (a set of two or three contenders), and maps it into a tuple - each element contains first
      // - one contender
      // - an array of the remaining contenders
      const assignments: [Contender, Contender[]][] = (pairing as Contender[]).map((contender, _, source) => {
        return [contender, source.filter(item => item.id !== contender.id)]
      })

      assignments.forEach(([ contender, opponents ]) => {
        this.#evaluateAssignmentForContender(contender, opponents, this.#retrieveUserBattleStats(contender, stats))
      })
    })
  }

  // Retrieves the user battle stats, creating a skeleton stats object if none exists
  #retrieveUserBattleStats(contender: Contender, stats: BattleStats) {
    if (!stats[contender.id]) {
      this.#debug('    initialising user stats')

      stats[contender.id] = {
        contenderId: contender.id,
        rounds: [{ isComplete: false, opponents: [] }]
      }
    }

    return stats[contender.id]
  }

  #evaluateAssignmentForContender(contender: Contender, opponents: Contender[], stats: BattleUserStats) {
    this.#debug('evaluating stats for: ', contender.name)

    opponents.forEach(opponent => {
      this.#evaluateOpponentForContender(contender, opponent, stats)
    })
  }

  #evaluateOpponentForContender(contender: Contender, opponent: Contender, stats: BattleUserStats) {
    this.#debug('    evaluating opponent: ', opponent.name)

    let incompleteRounds = stats.rounds.filter(round => !round.isComplete)
    if (incompleteRounds.length === 0) {
      this.#debug('        adding new user round as there are no incomplete rounds')
      stats.rounds.push({ isComplete: false, opponents: [] })
      incompleteRounds = stats.rounds.filter(round => !round.isComplete)
    }

    let round = incompleteRounds.find(round => !round.opponents.includes(opponent.id))

    if (!round) {
      this.#debug('        adding new user round user has already fought opponent')
      round = { isComplete: false, opponents: [] }
      stats.rounds.push(round)
    }

    round.opponents.push(opponent.id)
    this.#checkStatsRoundForCompletion(contender, round)
  }

  #checkStatsRoundForCompletion(user: Contender, userRound: BattleUserRound) {
    const allContendersHaveBeenFaced = this.#contenders
      // remove self
      .filter(contender => user.id !== contender.id)
      // remove avoids
      .filter(contender => shouldAllowPairingOfPair(user, contender))
      .reduce((memo, item) => {
        return memo && userRound.opponents.includes(item.id)
      }, true)

    if (allContendersHaveBeenFaced) {
      userRound.isComplete = true
    }
  }
}
