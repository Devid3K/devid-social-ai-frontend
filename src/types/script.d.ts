import type { Platform } from '@/enums'

export interface ScriptVariant {
  index: number
  title: string
  content: string
  hooks: string[]
  hashtags: string[]
}

export interface ViralAnalysis {
  score: number
  breakdown: {
    hookStrength: number
    emotionalImpact: number
    shareability: number
    trendAlignment: number
    callToAction: number
  }
  strengths: string[]
  improvements: string[]
  summary: string
}

export interface AiScript {
  id: number
  platform: Platform
  promptText: string
  scripts: ScriptVariant[]
  selectedIndex: number | null
  selectedScript: string | null
  viralScore: number | null
  viralAnalysis: ViralAnalysis | null
  provider?: string
  product?: any
  createdAt: string
  updatedAt?: string
}

export interface GenerateScriptParams {
  productName: string
  description: string
  targetAudience?: string
  platform: Platform
  count?: number
  tones?: string[]
  durationSeconds?: number
}
