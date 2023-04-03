import { defineStore } from "pinia";
import type { Contender, Roster } from "./rosters";
import LoopingContenderIterator from "./battle.iterator";

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
      const iterator = new LoopingContenderIterator(this.contenders)

      const resultingBattleRound: BattleRound = []

      let iteration = 0

      while (iterator.size > 0) {
        iteration++
        if (iteration > 10) {
          throw Error('infinite loop detected')
        }

        const redTeam = iterator.yank()

        if (!redTeam) {
          break;
        }

        // if there is one left over, they go in a random three
        if (iterator.isEmpty) {
          resultingBattleRound[Math.floor((Math.random() * resultingBattleRound.length))].push(redTeam)
        } else {
          const blueTeam = iterator.find(candidate => {
            if (redTeam.avoid && redTeam.avoid.test(candidate.name)) {
              return false
            }

            if (candidate.avoid && candidate.avoid.test(redTeam.name)) {
              return false
            }

            return true;
          }, true)

          if (!blueTeam) {
            throw Error('Cannot find a blueTeam')
          }

          resultingBattleRound.push([ redTeam, blueTeam ])
        }

        // console.info('pool at close', contenders)
        // console.info('round at close', round)
      }

      this.rounds.push(resultingBattleRound)
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
