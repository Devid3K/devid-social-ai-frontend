import { Platform } from '@/enums'
import { PLATFORM_LABELS, PLATFORM_ICONS, PLATFORM_COLORS } from '@/constants/platforms'

/**
 * Return the human-readable label for a platform.
 * e.g. Platform.TIKTOK → "TikTok"
 */
export function getPlatformLabel(platform: Platform): string {
  return PLATFORM_LABELS[platform] ?? platform
}

/**
 * Return the icon identifier for a platform (Iconify format).
 * e.g. Platform.TIKTOK → "mdi:music-note"
 */
export function getPlatformIcon(platform: Platform): string {
  return PLATFORM_ICONS[platform] ?? 'mdi:help-circle'
}

/**
 * Return the brand hex color for a platform.
 * e.g. Platform.TIKTOK → "#000000"
 */
export function getPlatformColor(platform: Platform): string {
  return PLATFORM_COLORS[platform] ?? '#666666'
}
