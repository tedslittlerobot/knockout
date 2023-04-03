import { defineStore } from "pinia";
import type { Contender, Roster } from "./rosters";

export default defineStore({
  id: "battle",

  state: (): BattleState => ({
    roster: { id: '', name: '', contenders: [] },
    excludedContenders: [],
    rounds: [],
    stats: {},
  }),

  getters: {
    contenders({ roster, excludedContenders }) {
      return roster.contenders.filter(item => !excludedContenders.includes(item.id))
    },
    currentRound(): BattleRound {
      return this.rounds[this.rounds.length - 1]
    }
  },

  actions: {
    begin(roster: Roster, exclusions: string[]) {
      this.$reset()

      this.roster = roster
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

        // console.info('pool at close', contenders)
        // console.info('round at close', round)
      }

      this.rounds.push(round)
    }
  },
});

export interface BattleState {
  roster: Roster
  excludedContenders: string[]
  rounds: BattleRound[]
  stats: { [key:string]: BattleUserStats }
}

export type BattleRound = BattleFaceOff[]
export type BattleFaceOff = [Contender, Contender, Contender?]

interface BattleUserStats {
  contenderId: string,
  rounds: BattleUserRound[]
}

interface BattleUserRound {
  isComplete: boolean
  opponents: string[]
}
