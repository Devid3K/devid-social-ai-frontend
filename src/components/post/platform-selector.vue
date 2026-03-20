<template>
  <n-select
    v-model:value="selected"
    :options="platformOptions"
    multiple
    :placeholder="placeholder"
    @update:value="$emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Platform } from '@/enums'

const props = withDefaults(
  defineProps<{
    modelValue?: Platform[]
    placeholder?: string
  }>(),
  { placeholder: 'Select platforms', modelValue: () => [] }
)

defineEmits<{
  (e: 'update:modelValue', value: Platform[]): void
}>()

const selected = ref<Platform[]>(props.modelValue)

watch(
  () => props.modelValue,
  (val) => { selected.value = val }
)

const platformOptions = Object.values(Platform).map((v) => ({
  label: v.charAt(0).toUpperCase() + v.slice(1),
  value: v,
}))
</script>
