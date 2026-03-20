<template>
  <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
    <span class="text-sm font-medium">{{ label }}</span>
    <div class="flex items-center gap-1">
      <span
        v-for="i in 3"
        :key="i"
        class="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce"
        :style="{ animationDelay: `${(i - 1) * 0.15}s` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
  }>(),
  { label: 'AI กำลังคิด...' }
)
</script>
