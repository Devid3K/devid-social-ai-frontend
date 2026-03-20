<template>
  <div class="flex items-center gap-3 px-4 py-4 border-t border-gray-200 dark:border-gray-700">
    <n-avatar round size="small" :src="authStore.user?.avatar || undefined">
      {{ initials }}
    </n-avatar>
    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
        {{ authStore.user?.name || authStore.user?.email || 'User' }}
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
        {{ authStore.user?.role }}
      </p>
    </div>
    <n-button quaternary circle size="small" @click="handleLogout" title="Logout">
      <template #icon>
        <n-icon>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </n-icon>
      </template>
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ROUTE_NAMES } from '@/constants/routes'

const authStore = useAuthStore()
const router = useRouter()

const initials = computed(() => {
  const name = authStore.user?.name || authStore.user?.email || ''
  return name.slice(0, 2).toUpperCase()
})

async function handleLogout() {
  await authStore.logout()
  router.push({ name: ROUTE_NAMES.LOGIN })
}
</script>
