<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <h1 class="text-2xl font-bold text-gray-900">Realtime Monitor</h1>
      <div class="flex items-center gap-3">
        <span
          class="inline-flex items-center gap-1.5 text-sm font-medium"
          :class="realtimeStore.connected ? 'text-green-600' : 'text-red-500'"
        >
          <span
            class="inline-block w-2 h-2 rounded-full"
            :class="realtimeStore.connected ? 'bg-green-500 animate-pulse' : 'bg-red-400'"
          />
          {{ realtimeStore.connected ? 'เชื่อมต่อแล้ว' : 'ไม่ได้เชื่อมต่อ' }}
        </span>
        <n-tag v-if="realtimeStore.onlineUsers > 0" size="small" type="info">
          ออนไลน์: {{ realtimeStore.onlineUsers }}
        </n-tag>
        <n-button size="small" @click="realtimeStore.clearEvents()">ล้าง</n-button>
      </div>
    </div>

    <!-- Live stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <n-card size="small">
        <p class="text-xs text-gray-500">สถานะ</p>
        <p class="text-xl font-bold" :class="realtimeStore.connected ? 'text-green-600' : 'text-red-500'">
          {{ realtimeStore.connected ? 'Connected' : 'Disconnected' }}
        </p>
      </n-card>
      <n-card size="small">
        <p class="text-xs text-gray-500">Event ทั้งหมด</p>
        <p class="text-xl font-bold text-rose-400">{{ realtimeStore.events.length }}</p>
      </n-card>
      <n-card size="small">
        <p class="text-xs text-gray-500">ผู้ใช้ออนไลน์</p>
        <p class="text-xl font-bold text-blue-600">{{ realtimeStore.onlineUsers }}</p>
      </n-card>
      <n-card size="small">
        <p class="text-xs text-gray-500">การแจ้งเตือนใหม่</p>
        <p class="text-xl font-bold text-orange-500">{{ notificationStore.unreadCount }}</p>
      </n-card>
    </div>

    <!-- Notifications list -->
    <n-card title="การแจ้งเตือน">
      <template #header-extra>
        <n-button
          v-if="notificationStore.hasUnread"
          size="small"
          type="primary"
          quaternary
          @click="notificationStore.markAllRead()"
        >
          อ่านทั้งหมด
        </n-button>
      </template>
      <div v-if="notificationStore.list.length === 0" class="text-center py-6 text-gray-400 text-sm">
        ยังไม่มีการแจ้งเตือน
      </div>
      <div v-else class="space-y-2 max-h-64 overflow-y-auto">
        <div
          v-for="n in notificationStore.list.slice(0, 10)"
          :key="n.id"
          class="flex items-start gap-3 p-3 rounded-lg border"
          :class="n.isRead ? 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'"
        >
          <n-tag size="small" :type="notifTagType(n.type)">{{ n.type }}</n-tag>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900">{{ n.title }}</p>
            <p class="text-xs text-slate-300 truncate">{{ n.message }}</p>
          </div>
          <div class="flex gap-1 shrink-0">
            <n-button v-if="!n.isRead" size="tiny" quaternary @click="notificationStore.markRead(n.id)">อ่าน</n-button>
            <n-button size="tiny" type="error" quaternary @click="notificationStore.delete(n.id)">ลบ</n-button>
          </div>
        </div>
      </div>
    </n-card>

    <!-- Event feed -->
    <n-card title="Live Event Feed">
      <div v-if="realtimeStore.recentEvents.length === 0" class="text-center py-8 text-gray-400 text-sm">
        รอรับ events...
      </div>
      <div v-else class="space-y-2 max-h-96 overflow-y-auto">
        <div
          v-for="event in realtimeStore.recentEvents"
          :key="event.id"
          class="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200"
        >
          <n-tag size="small" :type="eventTagType(event.type)">{{ event.type }}</n-tag>
          <div class="flex-1 min-w-0">
            <pre class="text-xs text-slate-300 whitespace-pre-wrap break-all">{{ JSON.stringify(event.payload, null, 2) }}</pre>
          </div>
          <span class="text-xs text-gray-400 flex-shrink-0">
            {{ new Date(event.receivedAt).toLocaleTimeString('th-TH') }}
          </span>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRealtimeStore } from '@/stores/realtime'
import { useNotificationStore } from '@/stores/notification'

const realtimeStore = useRealtimeStore()
const notificationStore = useNotificationStore()

onMounted(() => {
  notificationStore.fetch()
})

function eventTagType(type: string) {
  if (type.includes('complete') || type.includes('published')) return 'success'
  if (type.includes('failed') || type.includes('error')) return 'error'
  if (type.includes('progress')) return 'warning'
  if (type.includes('notification')) return 'info'
  return 'default'
}

function notifTagType(type: string) {
  switch (type) {
    case 'video_complete': return 'success'
    case 'post_published': return 'info'
    case 'trend_alert': return 'warning'
    case 'system': return 'default'
    default: return 'default'
  }
}
</script>
