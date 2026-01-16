/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_BASE: string
  readonly VITE_BASE_URL: string
  readonly VITE_API_URL: string
  readonly VITE_PORT: string
  readonly VITE_TITLE: string
  readonly VITE_CESIUM_TOKEN: string
  readonly VITE_CESIUM_TDT_TOKEN: string
}

interface Window {
  CESIUM_BASE_URL: string
}
