<template>
  <div class="flex flex-col h-full">
    <SidebarHeader />

    <div class="flex-1 overflow-y-auto py-2">
      <n-menu
        :options="menuOptions"
        :value="activeKey"
        :collapsed="false"
        @update:value="handleMenuSelect"
      />
    </div>

    <SidebarFooter />
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'
import { ROUTE_NAMES } from '@/constants/routes'
import SidebarHeader from './SidebarHeader.vue'
import SidebarFooter from './SidebarFooter.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const activeKey = computed(() => route.name as string)

function renderIcon(svgPath: string) {
  return () =>
    h(NIcon, null, {
      default: () =>
        h('svg', {
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': '2',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          innerHTML: svgPath,
        }),
    })
}

const menuOptions = computed<MenuOption[]>(() => {
  const items: MenuOption[] = [
    {
      label: 'Dashboard',
      key: ROUTE_NAMES.DASHBOARD,
      icon: renderIcon('<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>'),
    },
    {
      label: 'Script Generation',
      key: ROUTE_NAMES.SCRIPTS,
      icon: renderIcon('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>'),
    },
    {
      label: 'Video Generation',
      key: ROUTE_NAMES.VIDEOS,
      icon: renderIcon('<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>'),
    },
    {
      label: 'Trend Analysis',
      key: ROUTE_NAMES.TRENDS,
      icon: renderIcon('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>'),
    },
    {
      label: 'Auto Post',
      key: ROUTE_NAMES.POSTS,
      icon: renderIcon('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),
    },
    {
      label: 'Social Accounts',
      key: ROUTE_NAMES.ACCOUNTS,
      icon: renderIcon('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
    },
    {
      label: 'Prompt History',
      key: ROUTE_NAMES.PROMPT_HISTORY,
      icon: renderIcon('<polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"/>'),
    },
    {
      label: 'TikTok Trends',
      key: ROUTE_NAMES.TIKTOK_TRENDS,
      icon: renderIcon('<path d="M9 12l2 2 4-4"/><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.51 0 2.93.37 4.18 1.03"/>'),
    },
    {
      label: 'Finance',
      key: ROUTE_NAMES.FINANCE,
      icon: renderIcon('<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>'),
    },
    {
      label: 'Realtime',
      key: ROUTE_NAMES.REALTIME,
      icon: renderIcon('<circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>'),
    },
    {
      label: 'Profile',
      key: ROUTE_NAMES.PROFILE,
      icon: renderIcon('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'),
    },
  ]

  if (authStore.isSuperAdmin) {
    items.splice(items.length - 1, 0, {
      label: 'User Management',
      key: ROUTE_NAMES.USERS,
      icon: renderIcon('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/>'),
    })
  }

  return items
})

function handleMenuSelect(key: string) {
  router.push({ name: key })
}
</script>
