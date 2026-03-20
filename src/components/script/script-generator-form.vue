<template>
  <n-card title="Generate Script">
    <n-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-placement="top"
      @submit.prevent="handleSubmit"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <n-form-item label="Product Name" path="productName">
          <n-input
            v-model:value="formData.productName"
            placeholder="e.g. Vitamin C Serum"
          />
        </n-form-item>
        <n-form-item label="Target Audience" path="targetAudience">
          <n-input
            v-model:value="formData.targetAudience"
            placeholder="e.g. women 25-35"
          />
        </n-form-item>
      </div>

      <n-form-item label="Description" path="description">
        <n-input
          v-model:value="formData.description"
          type="textarea"
          placeholder="Describe the product or content..."
          :rows="3"
        />
      </n-form-item>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <n-form-item label="Platform" path="platform">
          <n-select
            v-model:value="formData.platform"
            :options="platformOptions"
            placeholder="Select platform"
          />
        </n-form-item>
        <n-form-item label="Variants" path="count">
          <n-input-number
            v-model:value="formData.count"
            :min="1"
            :max="5"
            class="w-full"
          />
        </n-form-item>
      </div>

      <div class="flex justify-end mt-2">
        <n-button
          type="primary"
          attr-type="submit"
          :loading="loading"
          :disabled="loading"
        >
          Generate Script
        </n-button>
      </div>
    </n-form>
  </n-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FormInst } from 'naive-ui'
import { Platform } from '@/enums'

const emit = defineEmits<{
  (e: 'submit', data: typeof formData.value): void
}>()

defineProps<{
  loading?: boolean
}>()

const formRef = ref<FormInst | null>(null)

const formData = ref({
  productName: '',
  description: '',
  targetAudience: '',
  platform: null as Platform | null,
  count: 3,
})

const rules = {
  productName: { required: true, message: 'Product name is required', trigger: 'blur' },
  description: { required: true, message: 'Description is required', trigger: 'blur' },
  platform: { required: true, message: 'Platform is required', trigger: 'change' },
}

const platformOptions = Object.values(Platform).map((v) => ({
  label: v.charAt(0).toUpperCase() + v.slice(1),
  value: v,
}))

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    emit('submit', { ...formData.value })
  } catch {
    // validation failed
  }
}
</script>
