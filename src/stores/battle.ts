import { defineStore } from "pinia";
import useRosters from "./rosters";

export default defineStore({
  id: "battle",

  state: (): BattleState => ({
    rosterIndex: 0,
  }),

  getters: {
    roster({ rosterIndex }) {
      const rosters = useRosters()

      return rosters.rosters[rosterIndex]
    },
  },

  actions: {
    //
  },
});

export interface BattleState {
  rosterIndex: number
}
