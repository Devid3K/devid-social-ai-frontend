<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <h1 class="text-2xl font-bold text-gray-900">บัญชีโซเชียล</h1>
      <n-button type="primary" @click="openAddModal">
        + เพิ่มบัญชี
      </n-button>
    </div>

    <n-alert v-if="accountsStore.error" type="error" closable @close="accountsStore.error = null">
      {{ accountsStore.error }}
    </n-alert>

    <!-- Loading state -->
    <div v-if="accountsStore.loading && accountsStore.list.length === 0" class="flex justify-center py-16">
      <n-spin size="large" />
    </div>

    <!-- Empty state -->
    <div v-else-if="accountsStore.list.length === 0" class="text-center py-16">
      <div class="text-gray-400 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="inline w-16 h-16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
      </div>
      <p class="text-gray-400 text-lg mb-1">ยังไม่มีบัญชีโซเชียลที่เชื่อมต่อ</p>
      <p class="text-gray-500 text-sm mb-4">เพิ่มบัญชีเพื่อเริ่มติดตามข้อมูล</p>
      <n-button type="primary" @click="openAddModal">เชื่อมต่อบัญชี</n-button>
    </div>

    <!-- Account cards grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <n-card
        v-for="account in accountsStore.list"
        :key="account.id"
        hoverable
        :style="{ borderLeft: `4px solid ${getPlatformColor(account.platform)}` }"
      >
        <div class="flex items-center gap-3 mb-3">
          <PlatformIcon :platform="account.platform" show-label />
          <div class="ml-auto">
            <n-tag :type="account.isActive ? 'success' : 'default'" size="small" round>
              {{ account.isActive ? 'เชื่อมต่อแล้ว' : 'ไม่เชื่อมต่อ' }}
            </n-tag>
          </div>
        </div>

        <p class="text-base font-semibold text-white truncate">
          {{ account.accountName }}
        </p>
        <p v-if="account.followers" class="text-sm text-slate-300 mt-1">
          ผู้ติดตาม: {{ formatNumber(account.followers) }}
        </p>
        <p class="text-xs text-slate-300 mt-1">
          ซิงค์ล่าสุด: {{ account.lastSyncAt ? formatRelativeTime(account.lastSyncAt) : 'ยังไม่เคย' }}
        </p>

        <div class="flex gap-2 mt-4">
          <n-button size="small" :loading="syncingId === account.id" @click="handleSync(account.id)">
            ซิงค์
          </n-button>
          <n-button size="small" @click="openEditModal(account)">
            แก้ไข
          </n-button>
          <n-popconfirm
            @positive-click="handleDelete(account.id)"
            positive-text="ลบ"
            negative-text="ยกเลิก"
          >
            <template #trigger>
              <n-button size="small" type="error" ghost>
                ลบ
              </n-button>
            </template>
            คุณต้องการลบบัญชี "{{ account.accountName }}" ใช่หรือไม่?
          </n-popconfirm>
        </div>
      </n-card>
    </div>

    <!-- Add account modal -->
    <n-modal v-model:show="showAddModal" preset="card" title="เพิ่มบัญชีโซเชียล" class="w-full max-w-md">
      <n-form ref="addFormRef" :model="newAccount" :rules="addRules" label-placement="top" @submit.prevent="handleAdd">
        <n-form-item label="แพลตฟอร์ม" path="platform">
          <n-select
            v-model:value="newAccount.platform"
            :options="platformOptions"
            placeholder="เลือกแพลตฟอร์ม"
          />
        </n-form-item>
        <n-form-item label="ชื่อบัญชี" path="accountName">
          <n-input v-model:value="newAccount.accountName" placeholder="ชื่อบัญชี เช่น @username" />
        </n-form-item>
        <n-form-item label="Account ID" path="accountId">
          <n-input v-model:value="newAccount.accountId" placeholder="รหัสบัญชี" />
        </n-form-item>
        <div class="flex justify-end gap-2 mt-2">
          <n-button @click="showAddModal = false">ยกเลิก</n-button>
          <n-button type="primary" attr-type="submit" :loading="accountsStore.loading">เพิ่มบัญชี</n-button>
        </div>
      </n-form>
    </n-modal>

    <!-- Edit account modal -->
    <n-modal v-model:show="showEditModal" preset="card" title="แก้ไขบัญชีโซเชียล" class="w-full max-w-md">
      <n-form ref="editFormRef" :model="editAccount" :rules="editRules" label-placement="top" @submit.prevent="handleEdit">
        <n-form-item label="แพลตฟอร์ม">
          <n-select
            :value="editAccount.platform"
            :options="platformOptions"
            disabled
          />
        </n-form-item>
        <n-form-item label="ชื่อบัญชี" path="accountName">
          <n-input v-model:value="editAccount.accountName" placeholder="ชื่อบัญชี" />
        </n-form-item>
        <n-form-item label="Account ID" path="accountId">
          <n-input v-model:value="editAccount.accountId" placeholder="รหัสบัญชี" />
        </n-form-item>
        <div class="flex justify-end gap-2 mt-2">
          <n-button @click="showEditModal = false">ยกเลิก</n-button>
          <n-button type="primary" attr-type="submit" :loading="accountsStore.loading">บันทึก</n-button>
        </div>
      </n-form>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { FormInst } from 'naive-ui'
import { useSocialAccountsStore } from '@/stores/social-accounts'
import { Platform } from '@/enums'
import { PLATFORM_LABELS } from '@/constants/platforms'
import { getPlatformColor } from '@/utils/platform'
import { formatNumber, formatRelativeTime } from '@/utils/format'
import PlatformIcon from '@/components/common/platform-icon.vue'
import type { SocialAccount } from '@/types/social.d'

const accountsStore = useSocialAccountsStore()

const showAddModal = ref(false)
const showEditModal = ref(false)
const syncingId = ref<number | null>(null)
const addFormRef = ref<FormInst | null>(null)
const editFormRef = ref<FormInst | null>(null)

const newAccount = ref({
  platform: null as Platform | null,
  accountName: '',
  accountId: '',
})

const editAccount = ref({
  id: 0,
  platform: null as Platform | null,
  accountName: '',
  accountId: '',
})

const platformOptions = Object.values(Platform).map((v) => ({
  label: PLATFORM_LABELS[v] ?? v,
  value: v,
}))

const addRules = {
  platform: [{ required: true, message: 'กรุณาเลือกแพลตฟอร์ม', trigger: 'change' }],
  accountName: [{ required: true, message: 'กรุณากรอกชื่อบัญชี', trigger: 'blur' }],
  accountId: [{ required: true, message: 'กรุณากรอก Account ID', trigger: 'blur' }],
}

const editRules = {
  accountName: [{ required: true, message: 'กรุณากรอกชื่อบัญชี', trigger: 'blur' }],
  accountId: [{ required: true, message: 'กรุณากรอก Account ID', trigger: 'blur' }],
}

onMounted(() => {
  accountsStore.fetch()
})

function openAddModal() {
  newAccount.value = { platform: null, accountName: '', accountId: '' }
  showAddModal.value = true
}

function openEditModal(account: SocialAccount) {
  editAccount.value = {
    id: account.id,
    platform: account.platform,
    accountName: account.accountName,
    accountId: account.accountId,
  }
  showEditModal.value = true
}

async function handleAdd() {
  try {
    await addFormRef.value?.validate()
  } catch {
    return
  }

  if (!newAccount.value.platform) return
  await accountsStore.create({
    platform: newAccount.value.platform,
    accountName: newAccount.value.accountName,
    accountId: newAccount.value.accountId,
  } as Partial<SocialAccount>)
  showAddModal.value = false
  newAccount.value = { platform: null, accountName: '', accountId: '' }
}

async function handleEdit() {
  try {
    await editFormRef.value?.validate()
  } catch {
    return
  }

  await accountsStore.update(editAccount.value.id, {
    accountName: editAccount.value.accountName,
    accountId: editAccount.value.accountId,
  })
  showEditModal.value = false
}

async function handleSync(id: number) {
  syncingId.value = id
  try {
    await accountsStore.sync(id)
  } finally {
    syncingId.value = null
  }
}

async function handleDelete(id: number) {
  await accountsStore.delete(id)
}
</script>
