<template>
  <n-popover trigger="click" placement="bottom-end" :width="360">
    <template #trigger>
      <n-button quaternary circle title="การแจ้งเตือน">
        <template #icon>
          <n-badge :value="unreadCount" :max="99" :show="unreadCount > 0">
            <n-icon size="20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </n-icon>
          </n-badge>
        </template>
      </n-button>
    </template>

    <div class="space-y-2">
      <div class="flex items-center justify-between px-1">
        <span class="text-sm font-semibold text-gray-900">การแจ้งเตือน</span>
        <n-button
          v-if="notificationStore.hasUnread"
          size="tiny"
          type="primary"
          quaternary
          @click="notificationStore.markAllRead()"
        >
          อ่านทั้งหมด
        </n-button>
      </div>

      <div v-if="notificationStore.list.length === 0" class="text-center py-4 text-gray-400 text-xs">
        ไม่มีการแจ้งเตือน
      </div>

      <div v-else class="max-h-80 overflow-y-auto space-y-1">
        <div
          v-for="n in notificationStore.list.slice(0, 15)"
          :key="n.id"
          class="flex items-start gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          :class="{ 'bg-blue-50 dark:bg-blue-900/20': !n.isRead }"
          @click="handleNotifClick(n)"
        >
          <span
            class="w-2 h-2 rounded-full mt-1.5 shrink-0"
            :class="n.isRead ? 'bg-transparent' : 'bg-blue-500'"
          />
          <div class="flex-1 min-w-0">
            <p class="text-xs font-medium text-white truncate">{{ n.title }}</p>
            <p class="text-xs text-slate-300 truncate">{{ n.message }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ formatTime(n.createdAt) }}</p>
          </div>
        </div>
      </div>
    </div>
  </n-popover>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useNotificationStore } from '@/stores/notification'
import { storeToRefs } from 'pinia'
import type { Notification } from '@/types/notification.d'

const notificationStore = useNotificationStore()
const { unreadCount } = storeToRefs(notificationStore)

onMounted(() => {
  notificationStore.fetch()
})

function handleNotifClick(n: Notification) {
  if (!n.isRead) {
    notificationStore.markRead(n.id)
  }
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)

  if (diffMin < 1) return 'เมื่อสักครู่'
  if (diffMin < 60) return `${diffMin} นาทีที่แล้ว`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour} ชั่วโมงที่แล้ว`
  return d.toLocaleDateString('th-TH')
}
</script>
