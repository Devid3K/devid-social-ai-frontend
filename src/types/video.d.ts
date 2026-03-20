import type { Platform, VideoJobStatus } from '@/enums'

export interface VideoJob {
  id: number
  scriptId: number | null
  platform: Platform
  style: VideoStyle
  status: VideoJobStatus
  videoUrl: string | null
  thumbnailUrl: string | null
  duration: number | null
  progress: number
  errorMessage: string | null
  createdAt: string
  updatedAt: string
}

export interface VideoStyle {
  id: string
  label: string
  icon: string
  description: string
}

export interface GenerateVideoParams {
  scriptId?: number
  platform: Platform
  style: string
  customPrompt?: string
}
