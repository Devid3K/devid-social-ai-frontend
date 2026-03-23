<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-message-provider>
            <GlobalSetup />
            <AppLayout />
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import AppLayout from '@/app-layouts/common/AppLayout.vue'
import {
  useLoadingBar,
  useDialog,
  useNotification,
  useMessage,
  darkTheme,
  type GlobalThemeOverrides,
} from 'naive-ui'

// ─── Theme overrides ──────────────────────────────────────────────
// Minimal: white + black + rose accent
const theme = null
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#f43f5e',
    primaryColorHover: '#fb7185',
    primaryColorPressed: '#e11d48',
    primaryColorSuppl: '#fda4af',
    borderRadius: '8px',
    fontFamily: "'M PLUS Rounded 1c', 'Prompt', sans-serif",
    bodyColor: '#ffffff',
    cardColor: '#ffffff',
    textColorBase: '#0f172a',
    textColor1: '#0f172a',
    textColor2: '#475569',
    textColor3: '#94a3b8',
    borderColor: '#e2e8f0',
    dividerColor: '#e2e8f0',
    hoverColor: '#fff1f2',
  },
  Button: {
    colorPrimary: '#f43f5e',
    colorHoverPrimary: '#fb7185',
    colorPressedPrimary: '#e11d48',
    textColorPrimary: '#ffffff',
    textColorHoverPrimary: '#ffffff',
    textColorPressedPrimary: '#ffffff',
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
