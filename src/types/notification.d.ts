import type { NotificationType } from '@/enums'

export interface Notification {
  id: number
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  metadata: Record<string, unknown> | null
  createdAt: string
}
