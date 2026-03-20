<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Script Generation</h1>
      <AiThinkingAnimation v-if="scriptStore.generating" />
    </div>

    <n-alert v-if="scriptStore.error" type="error" :title="scriptStore.error" closable />

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- Generator form -->
      <ScriptGeneratorForm :loading="scriptStore.generating" @submit="handleGenerate" />

      <!-- Script preview (current) -->
      <DramaScriptPreview
        v-if="previewScript"
        :script="previewScript"
      />
    </div>

    <!-- Generated variants -->
    <template v-if="generatedVariants.length > 0">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Generated Scripts</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ScriptCard
          v-for="(variant, i) in generatedVariants"
          :key="i"
          :script="variant"
          :index="i"
          :is-selected="selectedIndex === i"
          @select="handleSelect"
        />
      </div>
    </template>

    <!-- History list -->
    <n-card title="Recent Scripts">
      <LoadingSpinner v-if="scriptStore.loading" />
      <div v-else-if="scriptStore.list.length === 0" class="text-center py-6 text-gray-400 text-sm">
        No scripts yet. Generate your first script above.
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ScriptCard
          v-for="(script, i) in scriptStore.list"
          :key="script.id"
          :script="script"
          :index="i"
          :is-selected="false"
        />
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useScriptStore } from '@/stores/script'
import ScriptGeneratorForm from '@/components/script/script-generator-form.vue'
import ScriptCard from '@/components/script/script-card.vue'
import DramaScriptPreview from '@/components/script/drama-script-preview.vue'
import AiThinkingAnimation from '@/components/common/ai-thinking-animation.vue'
import LoadingSpinner from '@/components/common/loading-spinner.vue'

const scriptStore = useScriptStore()
const selectedIndex = ref<number | null>(null)

const generatedVariants = computed(() => {
  const current = scriptStore.current as any
  if (!current) return []
  if (Array.isArray(current.scripts)) return current.scripts
  if (Array.isArray(current.variants)) return current.variants
  return current.content ? [current] : []
})

const previewScript = computed(() => {
  if (selectedIndex.value != null && generatedVariants.value[selectedIndex.value]) {
    const v = generatedVariants.value[selectedIndex.value]
    return v.content ?? v.script ?? ''
  }
  return null
})

onMounted(() => {
  scriptStore.fetch()
})

async function handleGenerate(params: any) {
  selectedIndex.value = null
  await scriptStore.generate(params)
}

function handleSelect(index: number) {
  selectedIndex.value = index
}
</script>
