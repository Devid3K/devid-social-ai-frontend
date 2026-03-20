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
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">New Post</h1>
    </div>

    <n-alert v-if="postStore.error" type="error" :title="postStore.error" closable />

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- Form -->
      <n-card title="Post Details">
        <n-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-placement="top"
          @submit.prevent="handleSubmit"
        >
          <n-form-item label="Platforms" path="platforms">
            <PlatformSelector v-model="formData.platforms" />
          </n-form-item>

          <n-form-item label="Caption" path="caption">
            <CaptionEditor v-model="formData.caption" />
          </n-form-item>

          <n-form-item label="Schedule (optional)">
            <n-date-picker
              v-model:value="formData.scheduledAt"
              type="datetime"
              clearable
              class="w-full"
            />
          </n-form-item>

          <div class="flex gap-2 mt-2">
            <n-button
              type="default"
              :loading="postStore.loading"
              @click="handleSaveDraft"
            >
              Save Draft
            </n-button>
            <n-button
              type="primary"
              attr-type="submit"
              :loading="postStore.loading"
            >
              {{ formData.scheduledAt ? 'Schedule Post' : 'Publish Now' }}
            </n-button>
          </div>
        </n-form>
      </n-card>

      <!-- Preview -->
      <div>
        <PostPreviewCard v-if="previewPost" :post="previewPost as any" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInst } from 'naive-ui'
import { usePostStore } from '@/stores/post'
import { Platform, PostStatus } from '@/enums'
import { ROUTE_NAMES } from '@/constants/routes'
import PlatformSelector from '@/components/post/platform-selector.vue'
import CaptionEditor from '@/components/post/caption-editor.vue'
import PostPreviewCard from '@/components/post/post-preview-card.vue'

const postStore = usePostStore()
const router = useRouter()
const formRef = ref<FormInst | null>(null)

const formData = ref({
  platforms: [] as Platform[],
  caption: '',
  scheduledAt: null as number | null,
})

const rules = {
  platforms: { required: true, type: 'array', min: 1, message: 'Select at least one platform', trigger: 'change' },
  caption: { required: true, message: 'Caption is required', trigger: 'blur' },
}

const previewPost = computed(() => ({
  id: 0,
  platforms: formData.value.platforms,
  caption: formData.value.caption,
  status: formData.value.scheduledAt ? PostStatus.SCHEDULED : PostStatus.DRAFT,
  scheduledAt: formData.value.scheduledAt ? new Date(formData.value.scheduledAt).toISOString() : null,
  createdAt: new Date().toISOString(),
}))

async function handleSaveDraft() {
  await postStore.create({ ...formData.value, status: PostStatus.DRAFT } as any)
  router.push({ name: ROUTE_NAMES.POSTS })
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  await postStore.create({ ...formData.value } as any)
  router.push({ name: ROUTE_NAMES.POSTS })
}
</script>
