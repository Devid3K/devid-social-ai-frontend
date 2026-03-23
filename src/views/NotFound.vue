<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="text-center">
      <p class="text-8xl font-extrabold text-rose-400">404</p>
      <h1 class="mt-4 text-3xl font-bold text-gray-900">Page not found</h1>
      <p class="mt-2 text-gray-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div class="flex items-center justify-center gap-3 mt-8">
        <n-button @click="$router.back()">Go Back</n-button>
        <n-button type="primary" @click="$router.push({ name: ROUTE_NAMES.DASHBOARD })">
          Go to Dashboard
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ROUTE_NAMES } from '@/constants/routes'
</script>
