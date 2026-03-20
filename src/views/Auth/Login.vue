<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <AppLogo class="justify-center mb-4" />
        <h1 class="text-2xl font-bold text-white">Devid Social AI</h1>
        <p class="mt-1 text-sm text-gray-400">จัดการโซเชียลมีเดียด้วย AI</p>
      </div>

      <n-card class="shadow-2xl">
        <n-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-placement="top"
          @submit.prevent="handleLogin"
        >
          <n-form-item label="อีเมล" path="email">
            <n-input
              v-model:value="formData.email"
              type="email"
              placeholder="you@example.com"
              :disabled="loading"
              size="large"
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <n-icon :size="18">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
                </n-icon>
              </template>
            </n-input>
          </n-form-item>

          <n-form-item label="รหัสผ่าน" path="password">
            <n-input
              v-model:value="formData.password"
              type="password"
              placeholder="Enter your password"
              show-password-on="click"
              :disabled="loading"
              size="large"
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <n-icon :size="18">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/></svg>
                </n-icon>
              </template>
            </n-input>
          </n-form-item>

          <n-alert v-if="errorMsg" type="error" class="mb-4" closable @close="errorMsg = ''">
            {{ errorMsg }}
          </n-alert>

          <n-button
            type="primary"
            attr-type="submit"
            block
            :loading="loading"
            :disabled="loading"
            size="large"
            class="mt-2"
          >
            เข้าสู่ระบบ
          </n-button>
        </n-form>
      </n-card>

      <p class="text-center text-xs text-gray-500 mt-6">
        Powered by Devid Social AI Platform
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInst } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'
import { ROUTE_NAMES } from '@/constants/routes'
import AppLogo from '@/components/common/app-logo.vue'

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref<FormInst | null>(null)
const loading = ref(false)
const errorMsg = ref('')

const formData = ref({
  email: '',
  password: '',
})

const rules = {
  email: [
    { required: true, message: 'กรุณากรอกอีเมล', trigger: 'blur' },
    { type: 'email', message: 'กรุณากรอกอีเมลให้ถูกต้อง', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'กรุณากรอกรหัสผ่าน', trigger: 'blur' },
    { min: 6, message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', trigger: 'blur' },
  ],
}

async function handleLogin() {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  loading.value = true
  errorMsg.value = ''

  try {
    await authStore.login(formData.value.email, formData.value.password)
    router.push({ name: ROUTE_NAMES.DASHBOARD })
  } catch (err: any) {
    errorMsg.value = err?.response?.data?.message ?? err?.message ?? 'เข้าสู่ระบบล้มเหลว กรุณาลองใหม่อีกครั้ง'
  } finally {
    loading.value = false
  }
}
</script>
