import { defineStore } from "pinia";
import useRosters, { type Contender } from "./rosters";

export default defineStore({
  id: "battle",

  state: (): BattleState => ({
    rosterId: '',
    excludedContenders: [],
    rounds: [],
    stats: {},
  }),

  getters: {
    roster({ rosterId }) {
      const rosters = useRosters()

      return rosters.rosters.find(item => rosterId === item.id)!
    },
    contenders({ rosterId, excludedContenders }) {
      const rosters = useRosters()

      const roster = rosters.rosters.find(item => rosterId === item.id)!

      return roster.contenders.filter(item => !excludedContenders.includes(item.id))
    },
    currentRound(): BattleRound {
      return this.rounds[this.rounds.length - 1]
    }
  },

  actions: {
    begin(rosterId: string, exclusions: string[]) {
      this.$reset()

      this.rosterId = rosterId
      this.excludedContenders = exclusions

      this.nextRound()
    },
    nextRound() {
      const contenders = new Map(this.contenders.map(({id, name, avoid}) => [id, { id, name, avoid }]))
      let round: BattleRound = []

      let iteration = 0

      while (contenders.size > 0) {
        iteration++
        if (iteration > 10) {
          throw Error('infinite loop detected')
        }

        const iterator = contenders.entries()

        const prime = iterator.next().value as [string, Contender]
        contenders.delete(prime[0])

        // if there is one left over, they go in a random three
        if (contenders.size === 0) {
          round[Math.floor((Math.random() * round.length))].push(prime[1])
        } else {
          const candidate = iterator.next().value as [string, Contender]
          contenders.delete(candidate[0])

          round.push([ prime[1], candidate[1] ])
        }

        console.info('pool at close', contenders)
        console.info('round at close', round)
      }

      this.rounds.push(round)
    }
  },
});

export interface BattleState {
  rosterId: string
  excludedContenders: string[]
  rounds: BattleRound[]
  stats: { [key:string]: BattleUserStats }
}

type BattleRound = BattleFaceOff[]
type BattleFaceOff = [Contender, Contender, Contender?]

interface BattleUserStats {
  contenderId: string,
  rounds: BattleUserRound[]
}

interface BattleUserRound {
  isComplete: boolean
  opponents: string[]
}
