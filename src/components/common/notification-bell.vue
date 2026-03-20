<template>
  <div class="relative">
    <n-button quaternary circle @click="handleBellClick" title="Notifications">
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
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useNotificationStore } from '@/stores/notification'
import { storeToRefs } from 'pinia'

const notificationStore = useNotificationStore()
const { unreadCount } = storeToRefs(notificationStore)

onMounted(() => {
  notificationStore.fetch()
})

function handleBellClick() {
  // TODO: open notification drawer/popover
}
</script>
