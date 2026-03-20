<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Avatar + info -->
      <n-card class="text-center">
        <div class="flex flex-col items-center gap-3">
          <n-avatar
            round
            :size="80"
            :src="authStore.user?.avatar || undefined"
            class="text-2xl"
          >
            {{ initials }}
          </n-avatar>
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ authStore.user?.name || 'User' }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ authStore.user?.email }}</p>
          </div>
          <n-tag :type="authStore.isSuperAdmin ? 'warning' : 'default'" size="small">
            {{ authStore.user?.role }}
          </n-tag>
        </div>
      </n-card>

      <!-- Edit form -->
      <n-card title="Edit Profile" class="lg:col-span-2">
        <n-form
          :model="formData"
          label-placement="top"
          @submit.prevent="handleSave"
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <n-form-item label="Full Name">
              <n-input v-model:value="formData.name" placeholder="Your name" />
            </n-form-item>
            <n-form-item label="Email">
              <n-input v-model:value="formData.email" type="email" :disabled="true" />
            </n-form-item>
          </div>

          <n-divider>Change Password</n-divider>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <n-form-item label="New Password">
              <n-input
                v-model:value="formData.newPassword"
                type="password"
                show-password-on="click"
                placeholder="Leave blank to keep current"
              />
            </n-form-item>
            <n-form-item label="Confirm Password">
              <n-input
                v-model:value="formData.confirmPassword"
                type="password"
                show-password-on="click"
                placeholder="Confirm new password"
              />
            </n-form-item>
          </div>

          <n-alert v-if="successMsg" type="success" :title="successMsg" class="mb-3" closable />
          <n-alert v-if="errorMsg" type="error" :title="errorMsg" class="mb-3" closable />

          <div class="flex justify-end mt-2">
            <n-button type="primary" attr-type="submit" :loading="saving">Save Changes</n-button>
          </div>
        </n-form>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const saving = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const formData = ref({
  name: authStore.user?.name ?? '',
  email: authStore.user?.email ?? '',
  newPassword: '',
  confirmPassword: '',
})

const initials = computed(() => {
  const name = authStore.user?.name || authStore.user?.email || ''
  return name.slice(0, 2).toUpperCase()
})

async function handleSave() {
  successMsg.value = ''
  errorMsg.value = ''

  if (formData.value.newPassword && formData.value.newPassword !== formData.value.confirmPassword) {
    errorMsg.value = 'Passwords do not match.'
    return
  }

  saving.value = true
  try {
    // TODO: call update profile API
    await new Promise((r) => setTimeout(r, 500))
    successMsg.value = 'Profile updated successfully.'
  } catch (err: any) {
    errorMsg.value = err?.message ?? 'Failed to update profile.'
  } finally {
    saving.value = false
  }
}
</script>
