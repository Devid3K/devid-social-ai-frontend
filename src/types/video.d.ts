import type { VideoJobStatus } from '@/enums'

export interface VideoJob {
  id: number
  aiScriptId: number | null
  styleTemplate: string
  status: VideoJobStatus
  provider: string
  videoUrl: string | null
  thumbnailUrl: string | null
  duration: number | null
  progress: number
  errorMessage: string | null
  metaData: Record<string, any> | null
  aiScript: { id: number; promptText: string; platform: string } | null
  createdAt: string
  updatedAt: string
}

export interface VideoStyle {
  id: string
  label: string
  description: string
}

export interface GenerateVideoParams {
  prompt: string
  provider?: 'kling' | 'replicate'
  style?: string
  durationSeconds?: number
  aspectRatio?: string
  scriptId?: number
}
