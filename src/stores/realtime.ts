import { defineStore, acceptHMRUpdate } from 'pinia'

export interface RealtimeEvent {
  id: string
  type: string
  payload: unknown
  receivedAt: string
}

export const useRealtimeStore = defineStore('realtime', {
  state: () => ({
    connected: false,
    loading: false,
    error: null as string | null,
    events: [] as RealtimeEvent[],
    // Live analytics feed
    liveStats: {} as Record<string, unknown>,
    // Max events to keep in memory
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
      // TODO: add proper unique ID generation (e.g. crypto.randomUUID)
      const newEvent: RealtimeEvent = {
        id: `${Date.now()}-${Math.random()}`,
        ...event,
        receivedAt: new Date().toISOString(),
      }
      this.events.push(newEvent)
      // Trim to maxEvents to prevent unbounded growth
      if (this.events.length > this.maxEvents) {
        this.events = this.events.slice(-this.maxEvents)
      }
    },

    updateLiveStat(key: string, value: unknown) {
      // TODO: implement reactive live stat updates from socket
      this.liveStats[key] = value
    },

    clearEvents() {
      this.events = []
    },
  },
})

if (import.meta.hot) {
  acceptHMRUpdate(useRealtimeStore, import.meta.hot)
}
