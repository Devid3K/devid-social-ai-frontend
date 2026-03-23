<template>
  <div class="p-6 space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">TikTok Trending Products</h1>
      <p class="text-gray-500 text-sm mt-1">สินค้ามาแรงใน TikTok Shop — กดดูรายละเอียดและคลิปยอดนิยม</p>
    </div>

    <n-alert v-if="trendStore.error" type="error" :title="trendStore.error" closable />

    <!-- Product Grid -->
    <div v-if="trendStore.loading" class="flex justify-center py-12">
      <n-spin size="large" />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="product in trendStore.tiktokProducts"
        :key="product.id"
        class="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg hover:border-rose-200 transition-all duration-200"
        @click="openProductDetail(product)"
      >
        <!-- Thumbnail -->
        <div class="h-40 bg-gray-50 flex items-center justify-center overflow-hidden">
          <img
            :src="product.thumbnail"
            :alt="product.name"
            class="h-full w-full object-cover"
          />
        </div>

        <!-- Info -->
        <div class="p-4 space-y-2">
          <div class="flex items-start justify-between gap-2">
            <h3 class="font-bold text-gray-900 text-sm leading-tight">{{ product.name }}</h3>
            <n-tag :type="product.trendScore >= 85 ? 'error' : product.trendScore >= 75 ? 'warning' : 'info'" size="small" round>
              {{ product.trendScore }}
            </n-tag>
          </div>

          <p class="text-xs text-gray-500 line-clamp-2">{{ product.description }}</p>

          <div class="flex items-center justify-between text-xs text-gray-500">
            <span>{{ product.category }}</span>
            <span class="font-medium text-rose-500">{{ product.priceRange }}</span>
          </div>

          <div class="flex items-center gap-3 text-xs text-gray-400 pt-1 border-t border-gray-100">
            <span>📹 {{ (product.videoCount ?? 0).toLocaleString() }} clips</span>
            <span>💰 {{ (product.salesVolume ?? 0).toLocaleString() }} sold</span>
          </div>

          <!-- Top 3 hashtags -->
          <div class="flex flex-wrap gap-1">
            <n-tag
              v-for="tag in (product.relatedHashtags ?? []).slice(0, 3)"
              :key="tag"
              size="tiny"
              round
              class="text-rose-500"
            >
              #{{ tag }}
            </n-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Detail Modal -->
    <n-modal
      v-model:show="showModal"
      preset="card"
      :title="selectedProduct?.name ?? ''"
      style="max-width: 800px; max-height: 90vh;"
      :bordered="true"
      :closable="true"
      :segmented="{ content: true }"
    >
      <template v-if="selectedProduct">
        <div class="space-y-5">
          <!-- Product Header -->
          <div class="flex gap-4">
            <img
              :src="selectedProduct.thumbnail"
              :alt="selectedProduct.name"
              class="w-24 h-24 rounded-lg object-cover flex-shrink-0"
            />
            <div class="flex-1 space-y-1">
              <div class="flex items-center gap-2">
                <n-tag size="small" round>{{ selectedProduct.category }}</n-tag>
                <n-tag type="error" size="small" round>Score: {{ selectedProduct.trendScore }}</n-tag>
              </div>
              <p class="text-sm text-gray-600">{{ selectedProduct.description }}</p>
              <div class="flex items-center gap-4 text-sm">
                <span class="font-bold text-rose-500">{{ selectedProduct.priceRange }}</span>
                <span class="text-gray-400">Commission: {{ selectedProduct.commissionRate }}%</span>
              </div>
            </div>
          </div>

          <!-- Stats Row -->
          <div class="grid grid-cols-3 gap-3">
            <div class="bg-gray-50 rounded-lg p-3 text-center">
              <p class="text-lg font-bold text-gray-900">{{ (selectedProduct.salesVolume ?? 0).toLocaleString() }}</p>
              <p class="text-xs text-gray-500">ยอดขาย</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-3 text-center">
              <p class="text-lg font-bold text-gray-900">{{ (selectedProduct.videoCount ?? 0).toLocaleString() }}</p>
              <p class="text-xs text-gray-500">คลิปทั้งหมด</p>
            </div>
            <div class="bg-gray-50 rounded-lg p-3 text-center">
              <p class="text-lg font-bold text-rose-500">{{ selectedProduct.trendScore }}</p>
              <p class="text-xs text-gray-500">Viral Score</p>
            </div>
          </div>

          <!-- Hashtags -->
          <div class="flex flex-wrap gap-1.5">
            <n-tag
              v-for="tag in selectedProduct.relatedHashtags"
              :key="tag"
              size="small"
              round
              class="text-rose-500"
            >
              #{{ tag }}
            </n-tag>
          </div>

          <!-- Clips Filter -->
          <div class="flex items-center justify-between">
            <h3 class="font-bold text-gray-900">คลิปยอดนิยม</h3>
            <n-radio-group v-model:value="clipFilter" size="small">
              <n-radio-button value="all">ทั้งหมด ({{ clipsData?.total ?? 0 }})</n-radio-button>
              <n-radio-button value="organic">คนจริง ({{ clipsData?.organicCount ?? 0 }})</n-radio-button>
              <n-radio-button value="ai">AI ({{ clipsData?.aiCount ?? 0 }})</n-radio-button>
            </n-radio-group>
          </div>

          <!-- Clips List -->
          <div v-if="loadingClips" class="flex justify-center py-6">
            <n-spin />
          </div>

          <div v-else>
            <!-- Paginated clips -->
            <div class="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              <div
                v-for="clip in paginatedClips"
                :key="clip.id"
                class="flex gap-3 p-3 rounded-lg border border-gray-100 hover:border-rose-200 hover:bg-gray-50 transition-colors cursor-pointer"
                @click="playVideo(clip)"
              >
                <!-- Clip Thumbnail (uses product image as cover) -->
                <div class="relative flex-shrink-0 group">
                  <img
                    :src="clip.thumbnail"
                    :alt="clip.title"
                    class="w-20 h-28 rounded-md object-cover"
                  />
                  <!-- Play button overlay -->
                  <div class="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                  <span class="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded">
                    {{ formatDuration(clip.duration) }}
                  </span>
                  <span
                    v-if="clip.isAiGenerated"
                    class="absolute top-1 left-1 bg-purple-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded"
                  >
                    AI
                  </span>
                </div>

                <!-- Clip Info -->
                <div class="flex-1 min-w-0 space-y-1">
                  <p class="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">{{ clip.title }}</p>
                  <div class="flex items-center gap-2">
                    <img :src="clip.authorAvatar" class="w-4 h-4 rounded-full object-cover" />
                    <span class="text-xs text-gray-500">{{ clip.author }}</span>
                  </div>
                  <div class="flex items-center gap-3 text-xs text-gray-400">
                    <span>👁 {{ formatCount(clip.viewCount) }}</span>
                    <span>❤️ {{ formatCount(clip.likeCount) }}</span>
                    <span>💬 {{ formatCount(clip.commentCount) }}</span>
                    <span>🔄 {{ formatCount(clip.shareCount) }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <p class="text-[11px] text-gray-400">{{ formatDate(clip.postedAt) }}</p>
                    <a
                      :href="clip.tiktokUrl"
                      target="_blank"
                      rel="noopener"
                      class="text-[11px] text-rose-400 hover:text-rose-600 hover:underline"
                      @click.stop
                    >
                      🔗 TikTok
                    </a>
                  </div>
                </div>
              </div>

              <p v-if="filteredClips.length === 0" class="text-center text-gray-400 py-4">
                ไม่มีคลิปในหมวดนี้
              </p>
            </div>

            <!-- Pagination -->
            <div v-if="clipTotalPages > 1" class="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
              <span class="text-xs text-gray-400">
                {{ (clipPage - 1) * clipPageSize + 1 }}-{{ Math.min(clipPage * clipPageSize, filteredClips.length) }} / {{ filteredClips.length }} คลิป
              </span>
              <n-pagination
                v-model:page="clipPage"
                :page-count="clipTotalPages"
                :page-slot="5"
                size="small"
              />
            </div>
          </div>
        </div>
      </template>
    </n-modal>

    <!-- TikTok Video Modal -->
    <n-modal
      v-model:show="showVideoPlayer"
      preset="card"
      :title="playingClip?.title ?? 'Video'"
      style="max-width: 420px;"
      :bordered="true"
      :closable="true"
    >
      <template v-if="playingClip">
        <div class="space-y-3">
          <!-- TikTok Embed -->
          <div class="relative bg-black rounded-lg overflow-hidden" style="aspect-ratio: 9/16; max-height: 65vh;">
            <iframe
              :src="playingClip.videoUrl"
              class="w-full h-full border-0"
              allow="encrypted-media; fullscreen"
              allowfullscreen
            />
            <span
              v-if="playingClip.isAiGenerated"
              class="absolute top-3 left-3 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg z-10"
            >
              AI Generated
            </span>
          </div>

          <!-- Clip Info -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <img :src="playingClip.authorAvatar" class="w-8 h-8 rounded-full object-cover" />
                <div>
                  <p class="text-sm font-medium text-gray-900">@{{ playingClip.author }}</p>
                  <p class="text-xs text-gray-400">{{ formatDate(playingClip.postedAt) }}</p>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span>👁 {{ formatCount(playingClip.viewCount) }}</span>
              <span>❤️ {{ formatCount(playingClip.likeCount) }}</span>
              <span>💬 {{ formatCount(playingClip.commentCount) }}</span>
              <span>🔄 {{ formatCount(playingClip.shareCount) }}</span>
            </div>

            <!-- TikTok Link -->
            <a
              :href="playingClip.tiktokUrl"
              target="_blank"
              rel="noopener"
              class="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-lg text-sm font-medium transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.72a8.2 8.2 0 0 0 4.76 1.52V6.81a4.83 4.83 0 0 1-1-.12z"/>
              </svg>
              ดูบน TikTok
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>

            <!-- Link preview -->
            <div class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              <span class="text-xs text-gray-400 truncate flex-1">{{ playingClip.tiktokUrl }}</span>
              <n-button size="tiny" quaternary @click="copyLink(playingClip.tiktokUrl)">
                คัดลอก
              </n-button>
            </div>
          </div>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useTrendStore } from '@/stores/trend'
import type { TikTokProduct, TikTokClipsResponse, TikTokRelatedClip } from '@/types/trend.d'

const trendStore = useTrendStore()

const showModal = ref(false)
const selectedProduct = ref<TikTokProduct | null>(null)
const clipsData = ref<TikTokClipsResponse | null>(null)
const loadingClips = ref(false)
const clipFilter = ref<'all' | 'organic' | 'ai'>('all')

// Clips pagination
const clipPage = ref(1)
const clipPageSize = 5

const clipTotalPages = computed(() => Math.ceil(filteredClips.value.length / clipPageSize))

const paginatedClips = computed(() => {
  const start = (clipPage.value - 1) * clipPageSize
  return filteredClips.value.slice(start, start + clipPageSize)
})

// Reset page when filter changes
watch(clipFilter, () => { clipPage.value = 1 })

// Video player
const showVideoPlayer = ref(false)
const playingClip = ref<TikTokRelatedClip | null>(null)

function playVideo(clip: TikTokRelatedClip) {
  playingClip.value = clip
  showVideoPlayer.value = true
}

function copyLink(url: string) {
  navigator.clipboard.writeText(url)
  window.$message?.success('คัดลอกลิงก์แล้ว')
}

const filteredClips = computed<TikTokRelatedClip[]>(() => {
  if (!clipsData.value) return []
  const clips = clipsData.value.clips
  if (clipFilter.value === 'ai') return clips.filter((c) => c.isAiGenerated)
  if (clipFilter.value === 'organic') return clips.filter((c) => !c.isAiGenerated)
  return clips
})

async function openProductDetail(product: TikTokProduct) {
  selectedProduct.value = product
  showModal.value = true
  clipFilter.value = 'all'
  loadingClips.value = true
  try {
    clipsData.value = await trendStore.fetchRelatedClips(product.id)
  } finally {
    loadingClips.value = false
  }
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return String(n)
}

function formatDuration(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(() => {
  trendStore.fetchTikTokProducts()
})
</script>
