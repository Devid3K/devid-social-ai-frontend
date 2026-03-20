import type { Platform } from '@/enums'

export interface AiScript {
  id: number
  topic: string
  platform: Platform
  duration: number
  scripts: ScriptVariant[]
  selectedIndex: number | null
  viralScore: number | null
  createdAt: string
  updatedAt: string
}

export interface ScriptVariant {
  index: number
  content: string
  hooks: string[]
  hashtags: string[]
}

export interface GenerateScriptParams {
  topic: string
  platform: Platform
  duration: number
  tone?: string
  keywords?: string[]
}
