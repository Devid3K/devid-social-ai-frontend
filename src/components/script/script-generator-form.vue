<template>
  <n-card title="สร้างบทละคร">
    <n-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-placement="top"
      @submit.prevent="handleSubmit"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <n-form-item label="ชื่อสินค้า" path="productName">
          <n-input
            v-model:value="formData.productName"
            placeholder="เช่น Vitamin C Serum"
          />
        </n-form-item>
        <n-form-item label="กลุ่มเป้าหมาย" path="targetAudience">
          <n-input
            v-model:value="formData.targetAudience"
            placeholder="เช่น ผู้หญิง 25-35 ปี สนใจสกินแคร์"
          />
        </n-form-item>
      </div>

      <n-form-item label="รายละเอียดสินค้า" path="description">
        <n-input
          v-model:value="formData.description"
          type="textarea"
          placeholder="อธิบายสินค้าหรือเนื้อหาที่ต้องการโปรโมท..."
          :rows="3"
        />
      </n-form-item>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <n-form-item label="แพลตฟอร์ม" path="platform">
          <n-select
            v-model:value="formData.platform"
            :options="platformOptions"
            placeholder="เลือกแพลตฟอร์ม"
          />
        </n-form-item>
        <n-form-item label="จำนวนบทละคร" path="count">
          <n-input-number
            v-model:value="formData.count"
            :min="1"
            :max="5"
            class="w-full"
          />
        </n-form-item>
        <n-form-item label="ความยาววิดีโอ (วินาที)" path="durationSeconds">
          <n-input-number
            v-model:value="formData.durationSeconds"
            :min="15"
            :max="180"
            :step="15"
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
          size="large"
        >
          {{ loading ? 'กำลังสร้าง...' : 'สร้างบทละคร' }}
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
  durationSeconds: 60,
})

const rules = {
  productName: { required: true, message: 'กรุณาใส่ชื่อสินค้า', trigger: 'blur' },
  description: { required: true, message: 'กรุณาใส่รายละเอียด', trigger: 'blur' },
  platform: { required: true, message: 'กรุณาเลือกแพลตฟอร์ม', trigger: 'change' },
}

const platformOptions = [
  { label: 'TikTok', value: Platform.TIKTOK },
  { label: 'Instagram Reels', value: Platform.INSTAGRAM },
  { label: 'YouTube Shorts', value: Platform.YOUTUBE },
  { label: 'Facebook Reels', value: Platform.FACEBOOK },
]

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    emit('submit', { ...formData.value })
  } catch {
    // validation failed
  }
}
</script>
