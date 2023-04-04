import { defineStore } from "pinia";
import type { Contender, Roster } from "./rosters";
import swatch from "@/helpers/swatches";
import BattleRoundRunner from "@/helpers/BattleRoundRunner";

export default defineStore({
  id: "battle",

  state: (): BattleState => ({
    roster: { id: '', name: '', contenders: [] },
    swatches: {},
    excludedContenders: [],
    rounds: [],
    stats: {},
  }),

  getters: {
    contenders({ roster, excludedContenders }) {
      return roster.contenders.filter(item => !excludedContenders.includes(item.id))
    },
    currentRound(): BattleRound {
      const round = this.rounds[this.rounds.length - 1] || []

      return round.sort(() => 0.5 - Math.random())
    }
  },

  actions: {
    begin(roster: Roster, exclusions: string[]) {
      this.$reset()

      this.roster = roster
      this.excludedContenders = exclusions
      this.roster.contenders.forEach(({ id }, index) => {
        this.swatches[id] = swatch('battleText', index)
      })

      this.nextRound()
    },
    nextRound() {
      const runner = new BattleRoundRunner(this.contenders)

      runner.run(this.stats)

      this.rounds.push(runner.pairings)
      runner.updateStats(this.stats)
    }
  },
});

export interface BattleState {
  roster: Roster
  swatches: { [key:string]: { text: string } }
  excludedContenders: string[]
  rounds: BattleRound[]
  stats: BattleStats
}

export type BattleRound = BattleFaceOff[]
export type BattleFaceOff = [Contender, Contender, Contender?]

export interface BattleStats { [key:string]: BattleUserStats }

export interface BattleUserStats {
  contenderId: string,
  rounds: BattleUserRound[]
}

export interface BattleUserRound {
  isComplete: boolean
  opponents: string[]
}
