<template>
  <div class="space-y-1">
    <n-input
      v-model:value="text"
      type="textarea"
      :placeholder="placeholder"
      :maxlength="maxLength"
      :rows="rows"
      show-count
      @update:value="$emit('update:modelValue', $event)"
    />
    <div class="flex justify-end">
      <span
        class="text-xs"
        :class="text.length > maxLength * 0.9 ? 'text-orange-500' : 'text-gray-400'"
      >
        {{ text.length }} / {{ maxLength }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    maxLength?: number
    rows?: number
  }>(),
  {
    modelValue: '',
    placeholder: 'Write your caption...',
    maxLength: 2200,
    rows: 4,
  }
)

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const text = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => { text.value = val }
)
</script>
