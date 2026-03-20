<template>
  <div class="flex items-center justify-center p-8">
    <n-spin :size="size" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'small' | 'medium' | 'large'
  }>(),
  { size: 'medium' }
)
</script>
