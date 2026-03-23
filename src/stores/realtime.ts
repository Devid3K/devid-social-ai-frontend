import { defineStore, acceptHMRUpdate } from 'pinia'

export interface RealtimeEvent {
  id: string
  type: string
  payload: unknown
  receivedAt: string
}

let eventCounter = 0

export const useRealtimeStore = defineStore('realtime', {
  state: () => ({
    connected: false,
    loading: false,
    error: null as string | null,
    events: [] as RealtimeEvent[],
    liveStats: {} as Record<string, unknown>,
    onlineUsers: 0,
    maxEvents: 100,
  }),

  getters: {
    recentEvents: (state) => [...state.events].reverse().slice(0, 50),
  },

  actions: {
    setConnected(value: boolean) {
      this.connected = value
    },

    pushEvent(event: Omit<RealtimeEvent, 'id' | 'receivedAt'>) {
      const newEvent: RealtimeEvent = {
        id: `evt-${Date.now()}-${++eventCounter}`,
        ...event,
        receivedAt: new Date().toISOString(),
      }
      this.events.push(newEvent)
      if (this.events.length > this.maxEvents) {
        this.events = this.events.slice(-this.maxEvents)
      }
    },

    updateLiveStat(key: string, value: unknown) {
      this.liveStats = { ...this.liveStats, [key]: value }
    },

    setOnlineUsers(count: number) {
      this.onlineUsers = count
    },

    clearEvents() {
      this.events = []
    },
  },
})

if (import.meta.hot) {
  acceptHMRUpdate(useRealtimeStore, import.meta.hot)
}
