<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-message-provider>
            <GlobalSetup />
            <RouterView />
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue'
import {
  useLoadingBar,
  useDialog,
  useNotification,
  useMessage,
  darkTheme,
  type GlobalThemeOverrides,
} from 'naive-ui'

// ─── Theme overrides ──────────────────────────────────────────────
const theme = null // Use light theme by default; swap to darkTheme for dark mode
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#6366F1',
    primaryColorHover: '#818CF8',
    primaryColorPressed: '#4F46E5',
    primaryColorSuppl: '#818CF8',
    borderRadius: '8px',
  },
}

// ─── GlobalSetup ──────────────────────────────────────────────────
// Mounts Naive UI imperative APIs to window so they can be used outside Vue components.
const GlobalSetup = defineComponent({
  name: 'GlobalSetup',
  setup() {
    const loadingBar = useLoadingBar()
    const dialog = useDialog()
    const notification = useNotification()
    const message = useMessage()

    // Expose to window for use in Axios interceptors / global error handlers
    ;(window as any).$loadingBar = loadingBar
    ;(window as any).$dialog = dialog
    ;(window as any).$notification = notification
    ;(window as any).$message = message

    return () => null
  },
})
</script>
