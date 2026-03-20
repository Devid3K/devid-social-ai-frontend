<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Realtime Monitor</h1>
      <div class="flex items-center gap-2">
        <span
          class="inline-flex items-center gap-1.5 text-sm font-medium"
          :class="realtimeStore.connected ? 'text-green-600' : 'text-red-500'"
        >
          <span
            class="inline-block w-2 h-2 rounded-full"
            :class="realtimeStore.connected ? 'bg-green-500 animate-pulse' : 'bg-red-400'"
          />
          {{ realtimeStore.connected ? 'Connected' : 'Disconnected' }}
        </span>
        <n-button size="small" @click="realtimeStore.clearEvents()">Clear</n-button>
      </div>
    </div>

    <!-- Live stats -->
    <div v-if="Object.keys(realtimeStore.liveStats).length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <n-card
        v-for="(val, key) in realtimeStore.liveStats"
        :key="key"
        size="small"
      >
        <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ key }}</p>
        <p class="text-xl font-bold text-gray-900 dark:text-white">{{ val }}</p>
      </n-card>
    </div>

    <!-- Event feed -->
    <n-card title="Live Event Feed">
      <div v-if="realtimeStore.recentEvents.length === 0" class="text-center py-8 text-gray-400 text-sm">
        Waiting for events...
      </div>
      <div v-else class="space-y-2 max-h-96 overflow-y-auto">
        <div
          v-for="event in realtimeStore.recentEvents"
          :key="event.id"
          class="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        >
          <n-tag size="small" type="info">{{ event.type }}</n-tag>
          <div class="flex-1 min-w-0">
            <pre class="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-all">{{ JSON.stringify(event.payload, null, 2) }}</pre>
          </div>
          <span class="text-xs text-gray-400 flex-shrink-0">
            {{ new Date(event.receivedAt).toLocaleTimeString() }}
          </span>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { useRealtimeStore } from '@/stores/realtime'

const realtimeStore = useRealtimeStore()
// Socket connection is managed by the useRealtimeSocket composable initialized in App.vue
</script>
