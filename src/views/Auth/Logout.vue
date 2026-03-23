<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <n-spin size="large" />
      <p class="mt-4 text-sm text-gray-500">Signing out...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ROUTE_NAMES } from '@/constants/routes'

const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  await authStore.logout()
  router.replace({ name: ROUTE_NAMES.LOGIN })
})
</script>
