'use client'

import { useEffect } from 'react'
import { Bell, CheckCheck, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useNotificationsStore } from '@/store/notifications.store'
import { formatDateRelative } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import type { Notification } from '@/types/notification.types'

const TYPE_META: Record<string, { icon: string; color: string }> = {
  budget_alert:     { icon: '⚠️', color: 'text-warning' },
  goal_reached:     { icon: '🎉', color: 'text-income' },
  anomaly_detected: { icon: '🔍', color: 'text-expense' },
  import_complete:  { icon: '✅', color: 'text-income' },
  sync_failed:      { icon: '❌', color: 'text-expense' },
  report_ready:     { icon: '📊', color: 'text-primary' },
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: 'user_1', type: 'budget_alert', title: 'Presupuesto de Entretenimiento al 95%', message: 'Has gastado $57.000 de tus $60.000 del presupuesto mensual.', isRead: false, metadata: {}, createdAt: new Date(Date.now() - 1000 * 60 * 30) },
  { id: 'n2', userId: 'user_1', type: 'budget_alert', title: 'Presupuesto de Alimentación superado', message: 'Llevas $185.000 gastados de un límite de $200.000 (92.5%).', isRead: false, metadata: {}, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: 'n3', userId: 'user_1', type: 'import_complete', title: 'Importación completada', message: '45 transacciones importadas desde cartola_abril_2026.csv.', isRead: true, metadata: {}, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: 'n4', userId: 'user_1', type: 'goal_reached', title: '¡Meta alcanzada! 🎉', message: 'Lograste tu meta "Notebook nuevo" de $800.000. ¡Felicitaciones!', isRead: true, metadata: {}, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48) },
  { id: 'n5', userId: 'user_1', type: 'anomaly_detected', title: 'Gasto inusual detectado', message: 'Se detectó un cargo de $89.900 en Zara, mayor a tu gasto habitual en Compras.', isRead: true, metadata: {}, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72) },
]

function NotificationItem({ notification, onRead, onDelete }: { notification: Notification; onRead: (id: string) => void; onDelete: (id: string) => void }) {
  const meta = TYPE_META[notification.type] ?? { icon: '🔔', color: 'text-foreground' }

  return (
    <div className={cn('flex gap-3 p-4 group transition-colors', !notification.isRead && 'bg-primary/[0.03]')}>
      <span className="text-xl shrink-0 mt-0.5">{meta.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('text-sm font-medium', !notification.isRead && 'font-semibold')}>
            {notification.title}
          </p>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            {!notification.isRead && (
              <Button variant="ghost" size="icon" className="size-6" onClick={() => onRead(notification.id)}>
                <CheckCheck className="size-3.5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="size-6 text-muted-foreground" onClick={() => onDelete(notification.id)}>
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{notification.message}</p>
        <p className="text-xs text-muted-foreground/60 mt-1">{formatDateRelative(notification.createdAt)}</p>
      </div>
      {!notification.isRead && (
        <div className="size-2 rounded-full bg-primary shrink-0 mt-2" />
      )}
    </div>
  )
}

export default function NotificationsPage() {
  const { notifications, unreadCount, addNotification, markAsRead, markAllAsRead, removeNotification } =
    useNotificationsStore()

  // Seed mock notifications once
  useEffect(() => {
    if (notifications.length === 0) {
      MOCK_NOTIFICATIONS.forEach((n) => addNotification(n))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Notificaciones</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {unreadCount > 0 ? (
              <>{unreadCount} sin leer</>
            ) : 'Todas al día'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="size-3.5 mr-1.5" /> Marcar todas como leídas
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-0 flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="size-4" /> Historial
            {unreadCount > 0 && (
              <Badge className="text-xs px-1.5 py-0 h-4">{unreadCount}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 mt-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Bell className="size-10 text-muted-foreground/30 mb-3" />
              <p className="font-medium">Sin notificaciones</p>
              <p className="text-sm text-muted-foreground mt-1">Te avisaremos cuando haya novedades</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onRead={markAsRead}
                  onDelete={removeNotification}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
