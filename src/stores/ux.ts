import { defineStore } from "pinia";

export default defineStore({
  id: "ux",

  state: (): UxState => ({
    route: { route: 'home' },
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
  | HomeRoute
  | CreateRosterRoute
  | UpdateRosterRoute
  | PrepareBattleRoute;

export interface HomeRoute {
  route: 'home',
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
