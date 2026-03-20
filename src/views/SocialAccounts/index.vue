<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Social Accounts</h1>
      <n-button type="primary" @click="showAddModal = true">+ Add Account</n-button>
    </div>

    <n-alert v-if="accountsStore.error" type="error" :title="accountsStore.error" closable />

    <LoadingSpinner v-if="accountsStore.loading && accountsStore.list.length === 0" />

    <div v-else-if="accountsStore.list.length === 0" class="text-center py-16">
      <p class="text-gray-400">No social accounts connected yet.</p>
      <n-button type="primary" class="mt-4" @click="showAddModal = true">Connect Account</n-button>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <n-card
        v-for="account in accountsStore.list"
        :key="account.id"
        hoverable
      >
        <div class="flex items-center gap-3 mb-3">
          <PlatformIcon :platform="account.platform" show-label />
          <n-badge v-if="account.isActive" type="success" dot />
        </div>
        <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
          {{ account.username ?? account.accountName }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Last sync: {{ account.lastSyncAt ? new Date(account.lastSyncAt).toLocaleDateString() : 'Never' }}
        </p>
        <div class="flex gap-2 mt-3">
          <n-button size="tiny" @click="handleSync(account.id)">Sync</n-button>
          <n-button size="tiny" type="error" @click="handleDelete(account.id)">Remove</n-button>
        </div>
      </n-card>
    </div>

    <!-- Add account modal -->
    <n-modal v-model:show="showAddModal" preset="card" title="Add Social Account" class="w-full max-w-md">
      <n-form label-placement="top" @submit.prevent="handleAdd">
        <n-form-item label="Platform">
          <n-select v-model:value="newAccount.platform" :options="platformOptions" />
        </n-form-item>
        <n-form-item label="Username">
          <n-input v-model:value="newAccount.username" placeholder="@username" />
        </n-form-item>
        <n-form-item label="Access Token">
          <n-input v-model:value="newAccount.accessToken" type="password" show-password-on="click" placeholder="OAuth token" />
        </n-form-item>
        <div class="flex justify-end gap-2 mt-2">
          <n-button @click="showAddModal = false">Cancel</n-button>
          <n-button type="primary" attr-type="submit" :loading="accountsStore.loading">Add</n-button>
        </div>
      </n-form>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSocialAccountsStore } from '@/stores/social-accounts'
import { Platform } from '@/enums'
import PlatformIcon from '@/components/common/platform-icon.vue'
import LoadingSpinner from '@/components/common/loading-spinner.vue'

const accountsStore = useSocialAccountsStore()
const showAddModal = ref(false)

const newAccount = ref({
  platform: null as Platform | null,
  username: '',
  accessToken: '',
})

const platformOptions = Object.values(Platform).map((v) => ({
  label: v.charAt(0).toUpperCase() + v.slice(1),
  value: v,
}))

onMounted(() => {
  accountsStore.fetch()
})

async function handleSync(id: number) {
  await accountsStore.sync(id)
}

async function handleDelete(id: number) {
  await accountsStore.delete(id)
}

async function handleAdd() {
  if (!newAccount.value.platform) return
  await accountsStore.create({ ...newAccount.value } as any)
  showAddModal.value = false
  newAccount.value = { platform: null, username: '', accessToken: '' }
}
</script>
