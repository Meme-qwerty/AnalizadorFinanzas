export type NotificationType =
  | 'budget_alert'
  | 'goal_reached'
  | 'anomaly_detected'
  | 'import_complete'
  | 'sync_failed'
  | 'report_ready'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  metadata: Record<string, unknown>
  createdAt: Date
}
