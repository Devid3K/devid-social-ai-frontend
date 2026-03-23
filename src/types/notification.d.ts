import type { NotificationType } from '@/enums'

export interface Notification {
  id: number
  userId: number
  type: NotificationType
  title: string
  message: string
  data: Record<string, unknown> | null
  isRead: boolean
  createdAt: string
}
