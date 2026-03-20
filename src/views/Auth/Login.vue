<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <AppLogo class="justify-center mb-3" />
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Sign in to your account</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Devid Social AI Platform</p>
      </div>

      <n-card>
        <n-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-placement="top"
          @submit.prevent="handleLogin"
        >
          <n-form-item label="Email" path="email">
            <n-input
              v-model:value="formData.email"
              type="email"
              placeholder="you@example.com"
              :disabled="loading"
              @keyup.enter="handleLogin"
            />
          </n-form-item>

          <n-form-item label="Password" path="password">
            <n-input
              v-model:value="formData.password"
              type="password"
              placeholder="••••••••"
              show-password-on="click"
              :disabled="loading"
              @keyup.enter="handleLogin"
            />
          </n-form-item>

          <n-alert v-if="errorMsg" type="error" class="mb-4" :title="errorMsg" />

          <n-button
            type="primary"
            attr-type="submit"
            block
            :loading="loading"
            :disabled="loading"
            class="mt-2"
          >
            Sign In
          </n-button>
        </n-form>
      </n-card>
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
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Enter a valid email', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' },
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
    errorMsg.value = err?.response?.data?.message ?? err?.message ?? 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
