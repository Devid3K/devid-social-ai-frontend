<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">สร้างบทละคร AI</h1>
        <p class="text-sm text-slate-400 mt-1">สร้างบทละครสั้นสำหรับโปรโมทสินค้าด้วย AI</p>
      </div>
      <AiThinkingAnimation v-if="scriptStore.generating" label="AI กำลังสร้างบทละคร..." />
    </div>

    <!-- Error alert -->
    <n-alert v-if="scriptStore.error" type="error" closable @close="scriptStore.error = null">
      {{ scriptStore.error }}
    </n-alert>

    <!-- Main content: form + preview -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <ScriptGeneratorForm :loading="scriptStore.generating" @submit="handleGenerate" />

      <DramaScriptPreview
        :script="previewScript"
        :title="previewTitle"
      />
    </div>

    <!-- Generated script variants -->
    <template v-if="currentScripts.length > 0">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">
          บทละครที่สร้างได้ ({{ currentScripts.length }} variants)
        </h2>
        <n-button
          v-if="scriptStore.current && selectedIndex != null"
          size="small"
          type="info"
          :loading="scoringViral"
          @click="handleViralScore"
        >
          วิเคราะห์ Viral Score
        </n-button>
      </div>

      <!-- Viral analysis result -->
      <n-card
        v-if="viralAnalysis"
        size="small"
        class="border-l-4 border-l-indigo-500"
      >
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          <div class="text-center">
            <div class="text-2xl font-bold" :class="viralScoreColor">{{ viralAnalysis.score }}</div>
            <div class="text-xs text-gray-500">Overall</div>
          </div>
          <div v-for="(val, key) in viralAnalysis.breakdown" :key="key" class="text-center">
            <div class="text-lg font-semibold text-gray-700">{{ val }}</div>
            <div class="text-xs text-gray-500">{{ formatBreakdownKey(key as string) }}</div>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <n-tag v-for="s in viralAnalysis.strengths" :key="s" type="success" size="small">{{ s }}</n-tag>
          <n-tag v-for="s in viralAnalysis.improvements" :key="s" type="warning" size="small">{{ s }}</n-tag>
        </div>
        <p v-if="viralAnalysis.summary" class="text-sm text-slate-300 mt-2">
          {{ viralAnalysis.summary }}
        </p>
      </n-card>

      <!-- Script cards grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ScriptCard
          v-for="(variant, i) in currentScripts"
          :key="i"
          :script="variant"
          :index="i"
          :is-selected="selectedIndex === i"
          @select="handleSelect"
        />
      </div>
    </template>

    <!-- History -->
    <n-card title="ประวัติบทละคร">
      <template #header-extra>
        <n-pagination
          v-if="scriptStore.totalPages > 1"
          v-model:page="scriptStore.page"
          :page-count="scriptStore.totalPages"
          size="small"
          @update:page="scriptStore.fetch({ page: $event })"
        />
      </template>
      <LoadingSpinner v-if="scriptStore.loading" />
      <div v-else-if="scriptStore.list.length === 0" class="text-center py-8 text-gray-400 text-sm">
        ยังไม่มีบทละคร — สร้างบทละครแรกด้านบน
      </div>
      <div v-else class="space-y-3">
        <n-card
          v-for="script in scriptStore.list"
          :key="script.id"
          size="small"
          hoverable
          class="cursor-pointer"
          @click="loadScript(script)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <n-tag size="small" :type="script.platform === 'tiktok' ? 'info' : 'default'">
                {{ script.platform }}
              </n-tag>
              <span class="text-sm text-slate-200 truncate max-w-xs">
                {{ getScriptPreview(script) }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <ViralScoreBadge v-if="script.viralScore" :score="script.viralScore" />
              <span class="text-xs text-gray-400">
                {{ formatDate(script.createdAt) }}
              </span>
            </div>
          </div>
        </n-card>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useScriptStore } from '@/stores/script'
import type { AiScript, ScriptVariant, ViralAnalysis } from '@/types/script.d'
import ScriptGeneratorForm from '@/components/script/script-generator-form.vue'
import ScriptCard from '@/components/script/script-card.vue'
import DramaScriptPreview from '@/components/script/drama-script-preview.vue'
import AiThinkingAnimation from '@/components/common/ai-thinking-animation.vue'
import LoadingSpinner from '@/components/common/loading-spinner.vue'
import ViralScoreBadge from '@/components/common/viral-score-badge.vue'

const scriptStore = useScriptStore()
const selectedIndex = ref<number | null>(null)
const scoringViral = ref(false)
const viralAnalysis = ref<ViralAnalysis | null>(null)

const currentScripts = computed<ScriptVariant[]>(() => {
  if (!scriptStore.current) return []
  const scripts = scriptStore.current.scripts
  return Array.isArray(scripts) ? scripts : []
})

const previewScript = computed(() => {
  if (selectedIndex.value == null) return null
  const variant = currentScripts.value[selectedIndex.value]
  return variant?.content ?? null
})

const previewTitle = computed(() => {
  if (selectedIndex.value == null) return undefined
  const variant = currentScripts.value[selectedIndex.value]
  return variant?.title
})

const viralScoreColor = computed(() => {
  if (!viralAnalysis.value) return ''
  const score = viralAnalysis.value.score
  if (score >= 70) return 'text-green-600'
  if (score >= 40) return 'text-yellow-600'
  return 'text-red-600'
})

onMounted(() => {
  scriptStore.fetch()
})

async function handleGenerate(params: any) {
  selectedIndex.value = null
  viralAnalysis.value = null
  await scriptStore.generate(params)
  // Auto-select first variant
  if (currentScripts.value.length > 0) {
    selectedIndex.value = 0
  }
}

function handleSelect(index: number) {
  selectedIndex.value = index
  // Persist selection to backend
  if (scriptStore.current) {
    scriptStore.selectVariant(scriptStore.current.id, index)
  }
}

async function handleViralScore() {
  if (!scriptStore.current) return
  scoringViral.value = true
  try {
    const result = await scriptStore.fetchViralScore(scriptStore.current.id)
    viralAnalysis.value = result
  } finally {
    scoringViral.value = false
  }
}

function loadScript(script: AiScript) {
  scriptStore.current = script
  selectedIndex.value = script.selectedIndex ?? 0
  viralAnalysis.value = script.viralAnalysis ?? null
}

function getScriptPreview(script: AiScript): string {
  const scripts = script.scripts
  if (Array.isArray(scripts) && scripts.length > 0) {
    return scripts[0].title || scripts[0].content?.slice(0, 80) || 'Untitled'
  }
  return script.promptText?.slice(0, 80) || 'Script'
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatBreakdownKey(key: string): string {
  const map: Record<string, string> = {
    hookStrength: 'Hook',
    emotionalImpact: 'Emotion',
    shareability: 'Share',
    trendAlignment: 'Trend',
    callToAction: 'CTA',
  }
  return map[key] ?? key
}
</script>
