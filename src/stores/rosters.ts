import { defineStore } from "pinia";

function loadRosters(): Roster[]|null {
  const rosters = localStorage.getItem('rosters')

  if (!rosters) {
    return null
  }

  const parsed = JSON.parse(rosters) as any[]

  return parsed.map((roster) => {
    const id = roster.id as string
    const name = roster.name as string
    const contenders: Contender[] = (roster.contenders as any[]).map(item => ({
      id: item.id,
      name: item.name,
      avoid: item.avoid ? new RegExp(item.avoid) : null,
    }))

    return { id, name, contenders }
  })
}

export default defineStore({
  id: "rosters",

  state: (): RosterState => ({
    rosters: loadRosters() || [],
  }),

  getters: {
    //
  },

  actions: {
    add(roster: Roster) {
      this.rosters.push(roster)

      this.persist()
    },
    update(roster: Roster) {
      const target = this.rosters.find(item => item.id === roster.id)!
      target.name = roster.name
      target.contenders = roster.contenders

      this.persist()
    },
    persist() {
      localStorage.setItem('rosters', JSON.stringify(this.rosters))
    },
  },
});

export interface RosterState {
  rosters: Roster[]
}

export interface Roster {
  id: string
  name: string
  contenders: Contender[]
}

export interface Contender {
  id: string,
  name: string
  avoid: RegExp|null
}
