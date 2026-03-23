<template>
  <div class="flex h-screen overflow-hidden bg-white">
    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-20 bg-black/30 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 lg:relative lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <Sidebar />
    </aside>

    <!-- Main content -->
    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <!-- Top bar (mobile) -->
      <header class="flex items-center gap-4 px-4 py-3 bg-white border-b border-gray-200 lg:hidden">
        <n-button quaternary circle @click="sidebarOpen = !sidebarOpen">
          <template #icon>
            <n-icon size="20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </n-icon>
          </template>
        </n-button>
        <span class="font-bold text-gray-900">Devid Social AI</span>
        <div class="ml-auto">
          <NotificationBell />
        </div>
      </header>

      <!-- Desktop top bar -->
      <header class="hidden lg:flex items-center justify-end gap-4 px-6 py-3 bg-white border-b border-gray-200">
        <NotificationBell />
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto bg-gray-50">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from './Sidebar.vue'
import NotificationBell from '@/components/common/notification-bell.vue'
</script>
