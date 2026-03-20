<template>
  <div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-900">
    <AppLogo class="mb-6" />
    <n-spin size="large" />
    <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading...</p>
  </div>
</template>

<script setup lang="ts">
import AppLogo from '@/components/common/app-logo.vue'
</script>
