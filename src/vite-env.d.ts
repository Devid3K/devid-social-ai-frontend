/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_SOCKET_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare interface Window {
  $notification: import('naive-ui').NotificationApiInjection
  $message: import('naive-ui').MessageApiInjection
  $dialog: import('naive-ui').DialogApiInjection
  $loadingBar: import('naive-ui').LoadingBarApiInjection
}
