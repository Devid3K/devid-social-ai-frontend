import { Platform } from '@/enums'

export const PLATFORM_LABELS: Record<Platform, string> = {
  [Platform.TIKTOK]: 'TikTok',
  [Platform.FACEBOOK]: 'Facebook Reel',
  [Platform.INSTAGRAM]: 'Instagram Reel',
  [Platform.YOUTUBE]: 'YouTube Short',
}

export const PLATFORM_ICONS: Record<Platform, string> = {
  [Platform.TIKTOK]: 'mdi:music-note',
  [Platform.FACEBOOK]: 'mdi:facebook',
  [Platform.INSTAGRAM]: 'mdi:instagram',
  [Platform.YOUTUBE]: 'mdi:youtube',
}

export const PLATFORM_COLORS: Record<Platform, string> = {
  [Platform.TIKTOK]: '#000000',
  [Platform.FACEBOOK]: '#1877F2',
  [Platform.INSTAGRAM]: '#E4405F',
  [Platform.YOUTUBE]: '#FF0000',
}
