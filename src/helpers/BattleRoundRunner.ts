import type { Contender } from "@/stores/rosters";
import helpers from './battleHelpers'
import LoopingContenderIterator from "./LoopingContenderIterator";
import type { BattleRound, BattleStats, BattleUserRound, BattleUserStats } from "@/stores/battle";

export default class BattleRoundRunner {
  #contenders: Contender[]
  #iterator: LoopingContenderIterator
  pairings: BattleRound = []

  #remainingSafeIterations = 1000

  constructor(source: Contender[]) {
    this.#contenders = source
    this.#iterator = new LoopingContenderIterator(helpers.prioritiseContenders(source))
  }

  run() {
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
      if (this.#iterator.isEmpty) {
        this.assignThreesome(incumbant)
      } else {
        const challenger = this.findChallenger(incumbant)

        if (!challenger) {
          throw Error('Cannot find a challenger')
        }

        this.pairings.push([ incumbant, challenger ])
      }

      this.#debug('End of Loop', this)
    }
  }

  assignThreesome(thirdWheel: Contender) {
    this.pairings[Math.floor((Math.random() * this.pairings.length))].push(thirdWheel)
  }

  findChallenger(target: Contender) {
    return this.#iterator.startFromBeginning().find(candidate => {
      return helpers.shouldAllowPairing(target, candidate)
    }, true)
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
      .filter(contender => helpers.shouldAllowPairing(user, contender))
      .reduce((memo, item) => {
        return memo && userRound.opponents.includes(item.id)
      }, true)

    if (allContendersHaveBeenFaced) {
      userRound.isComplete = true
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  #debug(message: string, data?: any) {
    // console.info(message, data)
  }
}
