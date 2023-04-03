import { defineStore } from "pinia";

export default defineStore({
  id: "ux",

  state: (): UxState => ({
    route: { route: 'roster:index' },
  }),

  getters: {
    //
  },

  actions: {
    //
  },
});

export interface UxState {
  route: UxRoute
}

export type UxRoute =
  | RosterIndexRoute
  | CreateRosterRoute
  | UpdateRosterRoute
  | PrepareBattleRoute
  | BattleRoute;

export interface RosterIndexRoute {
  route: 'roster:index',
}

export interface CreateRosterRoute {
  route: 'roster:create',
}

export interface UpdateRosterRoute {
  route: 'roster:update',
  rosterId: string,
}

export interface PrepareBattleRoute {
  route: 'battle:prepare',
  rosterId: string,
}

export interface BattleRoute {
  route: 'battle:face-off',
}
