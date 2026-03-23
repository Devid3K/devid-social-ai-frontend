<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center gap-3">
      <n-button quaternary circle @click="$router.back()">
        <template #icon>
          <n-icon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </n-icon>
        </template>
      </n-button>
      <h1 class="text-2xl font-bold text-gray-900">สร้างโพสต์ใหม่</h1>
    </div>

    <n-alert v-if="postStore.error" type="error" :title="postStore.error" closable />

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- Form -->
      <n-card title="รายละเอียดโพสต์">
        <n-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-placement="top"
          @submit.prevent="handleSubmit"
        >
          <n-form-item label="บัญชีโซเชียล" path="socialAccountId">
            <n-select
              v-model:value="formData.socialAccountId"
              :options="accountOptions"
              placeholder="เลือกบัญชี"
              @update:value="handleAccountChange"
            />
          </n-form-item>

          <n-form-item label="แพลตฟอร์ม" path="platform">
            <n-tag v-if="selectedAccount" :type="platformTagType">
              {{ selectedAccount.platform.toUpperCase() }}
            </n-tag>
            <span v-else class="text-sm text-gray-400">เลือกบัญชีก่อน</span>
          </n-form-item>

          <n-form-item label="แคปชั่น" path="caption">
            <CaptionEditor v-model="formData.caption" placeholder="เขียนแคปชั่นของคุณ..." />
          </n-form-item>

          <n-form-item label="แฮชแท็ก">
            <n-dynamic-tags v-model:value="formData.hashtags" />
          </n-form-item>

          <n-form-item label="ตั้งเวลาโพสต์ (ไม่บังคับ)">
            <n-date-picker
              v-model:value="formData.scheduledAt"
              type="datetime"
              clearable
              class="w-full"
              :is-date-disabled="isPastDate"
            />
          </n-form-item>

          <div class="flex gap-2 mt-2">
            <n-button
              :loading="postStore.loading"
              @click="handleSaveDraft"
            >
              บันทึกแบบร่าง
            </n-button>
            <n-button
              v-if="formData.scheduledAt"
              type="info"
              :loading="postStore.loading"
              @click="handleSchedule"
            >
              ตั้งเวลาโพสต์
            </n-button>
            <n-button
              v-else
              type="primary"
              attr-type="submit"
              :loading="postStore.loading"
            >
              เผยแพร่ทันที
            </n-button>
          </div>
        </n-form>
      </n-card>

      <!-- Preview -->
      <div class="space-y-4">
        <n-card title="ตัวอย่างโพสต์">
          <div class="space-y-3">
            <div v-if="selectedAccount" class="flex items-center gap-2">
              <n-tag size="small" :type="platformTagType">
                {{ selectedAccount.platform }}
              </n-tag>
              <span class="text-sm text-gray-500">{{ selectedAccount.accountName }}</span>
            </div>
            <p class="text-sm text-slate-200 whitespace-pre-wrap">
              {{ formData.caption || 'ยังไม่มีแคปชั่น...' }}
            </p>
            <div v-if="formData.hashtags.length" class="flex flex-wrap gap-1">
              <n-tag
                v-for="tag in formData.hashtags"
                :key="tag"
                size="small"
                type="info"
              >
                #{{ tag.replace(/^#/, '') }}
              </n-tag>
            </div>
            <div v-if="formData.scheduledAt" class="text-xs text-gray-400">
              ตั้งเวลา: {{ new Date(formData.scheduledAt).toLocaleString('th-TH') }}
            </div>
          </div>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInst } from 'naive-ui'
import { usePostStore } from '@/stores/post'
import { useSocialAccountsStore } from '@/stores/social-accounts'
import { ROUTE_NAMES } from '@/constants/routes'
import CaptionEditor from '@/components/post/caption-editor.vue'

const postStore = usePostStore()
const accountsStore = useSocialAccountsStore()
const router = useRouter()
const formRef = ref<FormInst | null>(null)

const formData = ref({
  socialAccountId: null as number | null,
  platform: '' as string,
  caption: '',
  hashtags: [] as string[],
  scheduledAt: null as number | null,
})

const rules = {
  socialAccountId: { required: true, type: 'number', message: 'กรุณาเลือกบัญชี', trigger: 'change' },
  caption: { required: true, message: 'กรุณาใส่แคปชั่น', trigger: 'blur' },
}

const selectedAccount = computed(() =>
  accountsStore.list.find((a) => a.id === formData.value.socialAccountId)
)

const platformTagType = computed(() => {
  switch (selectedAccount.value?.platform) {
    case 'tiktok': return 'default'
    case 'facebook': return 'info'
    case 'instagram': return 'warning'
    case 'youtube': return 'error'
    default: return 'default'
  }
})

const accountOptions = computed(() =>
  accountsStore.activeAccounts.map((a) => ({
    label: `${a.accountName} (${a.platform})`,
    value: a.id,
  }))
)

function isPastDate(ts: number) {
  return ts < Date.now() - 86400000
}

function handleAccountChange(id: number) {
  const account = accountsStore.list.find((a) => a.id === id)
  if (account) {
    formData.value.platform = account.platform
  }
}

async function handleSaveDraft() {
  if (!formData.value.socialAccountId || !formData.value.platform) return
  await postStore.create({
    socialAccountId: formData.value.socialAccountId,
    platform: formData.value.platform as any,
    caption: formData.value.caption,
    hashtags: formData.value.hashtags,
  })
  router.push({ name: ROUTE_NAMES.POSTS })
}

async function handleSchedule() {
  try {
    await formRef.value?.validate()
  } catch { return }

  if (!formData.value.socialAccountId || !formData.value.scheduledAt) return

  const post = await postStore.create({
    socialAccountId: formData.value.socialAccountId,
    platform: formData.value.platform as any,
    caption: formData.value.caption,
    hashtags: formData.value.hashtags,
  })

  if (post?.id) {
    await postStore.schedule(post.id, {
      scheduledAt: new Date(formData.value.scheduledAt).toISOString(),
    })
  }
  router.push({ name: ROUTE_NAMES.POSTS })
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
  } catch { return }

  if (!formData.value.socialAccountId) return

  const post = await postStore.create({
    socialAccountId: formData.value.socialAccountId,
    platform: formData.value.platform as any,
    caption: formData.value.caption,
    hashtags: formData.value.hashtags,
  })

  if (post?.id) {
    await postStore.publish(post.id)
  }
  router.push({ name: ROUTE_NAMES.POSTS })
}

onMounted(() => {
  if (accountsStore.list.length === 0) {
    accountsStore.fetch()
  }
})
</script>
