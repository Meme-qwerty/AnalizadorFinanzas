'use client'

import { useState } from 'react'
import { Moon, Sun, Eye, EyeOff, Bell, Globe, Shield, User, Palette, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { usePrivacyMode } from '@/hooks/usePrivacyMode'
import { useThemeStore } from '@/store/theme.store'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

function SettingsSection({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className="size-4 text-muted-foreground" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  )
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const { privacyMode, togglePrivacyMode } = usePrivacyMode()
  const { theme, setTheme } = useThemeStore()
  const { logout, user } = useAuthStore()
  const router = useRouter()
  const [notifBudget, setNotifBudget] = useState(true)
  const [notifGoals, setNotifGoals] = useState(true)
  const [notifAnomalies, setNotifAnomalies] = useState(true)
  const [notifImports, setNotifImports] = useState(false)
  const [displayName, setDisplayName] = useState(user?.name ?? '')
  const [saved, setSaved] = useState(false)

  const handleSaveProfile = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">Configuración</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Personaliza tu experiencia</p>
      </div>

      {/* Profile */}
      <SettingsSection title="Perfil" icon={User}>
        <div className="space-y-1.5">
          <Label>Nombre</Label>
          <div className="flex gap-2">
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="flex-1" />
            <Button variant="outline" onClick={handleSaveProfile}>
              {saved ? '✓ Guardado' : 'Guardar'}
            </Button>
          </div>
        </div>
        <Separator />
        <SettingRow label="Correo electrónico" description="No se puede cambiar por ahora">
          <Badge variant="secondary" className="text-xs font-mono">{user?.email}</Badge>
        </SettingRow>
        <Separator />
        <SettingRow label="Cerrar sesión" description="Salir de tu cuenta en este dispositivo">
          <Button
            variant="outline"
            size="sm"
            onClick={() => { logout(); router.replace('/login') }}
          >
            Cerrar sesión
          </Button>
        </SettingRow>
      </SettingsSection>

      {/* Appearance */}
      <SettingsSection title="Apariencia" icon={Palette}>
        <SettingRow label="Tema" description="Elige entre claro, oscuro o el del sistema">
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            {([
              { value: 'light', icon: Sun, label: 'Claro' },
              { value: 'system', icon: Monitor, label: 'Sistema' },
              { value: 'dark', icon: Moon, label: 'Oscuro' },
            ] as const).map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors',
                  theme === value
                    ? 'bg-background shadow text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="size-3" />
                {label}
              </button>
            ))}
          </div>
        </SettingRow>
        <Separator />
        <SettingRow
          label="Modo privacidad"
          description="Oculta los montos en todas las vistas"
        >
          <div className="flex items-center gap-2">
            <Eye className={cn('size-3.5', !privacyMode ? 'text-foreground' : 'text-muted-foreground')} />
            <Switch checked={privacyMode} onCheckedChange={togglePrivacyMode} />
            <EyeOff className={cn('size-3.5', privacyMode ? 'text-foreground' : 'text-muted-foreground')} />
          </div>
        </SettingRow>
      </SettingsSection>

      {/* Region */}
      <SettingsSection title="Región e idioma" icon={Globe}>
        <SettingRow label="Moneda" description="Moneda principal para mostrar montos">
          <Badge variant="secondary">CLP — Peso chileno</Badge>
        </SettingRow>
        <Separator />
        <SettingRow label="Idioma" description="Idioma de la interfaz">
          <Badge variant="secondary">Español (Chile)</Badge>
        </SettingRow>
        <Separator />
        <SettingRow label="Formato de fecha" description="Cómo se muestran las fechas">
          <Badge variant="secondary">DD/MM/AAAA</Badge>
        </SettingRow>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title="Notificaciones" icon={Bell}>
        <SettingRow label="Alertas de presupuesto" description="Avisa cuando superes el 80% del límite">
          <Switch checked={notifBudget} onCheckedChange={setNotifBudget} />
        </SettingRow>
        <Separator />
        <SettingRow label="Metas alcanzadas" description="Notifica cuando logres una meta de ahorro">
          <Switch checked={notifGoals} onCheckedChange={setNotifGoals} />
        </SettingRow>
        <Separator />
        <SettingRow label="Gastos inusuales" description="Detecta y avisa sobre gastos fuera de lo común">
          <Switch checked={notifAnomalies} onCheckedChange={setNotifAnomalies} />
        </SettingRow>
        <Separator />
        <SettingRow label="Importaciones completadas" description="Confirma cuando se procese un CSV">
          <Switch checked={notifImports} onCheckedChange={setNotifImports} />
        </SettingRow>
      </SettingsSection>

      {/* Data & Privacy */}
      <SettingsSection title="Datos y privacidad" icon={Shield}>
        <SettingRow label="Exportar todos mis datos" description="Descarga un ZIP con toda tu información">
          <Button variant="outline" size="sm">Exportar</Button>
        </SettingRow>
        <Separator />
        <SettingRow label="Eliminar cuenta" description="Elimina permanentemente tu cuenta y datos">
          <Button variant="destructive" size="sm">Eliminar</Button>
        </SettingRow>
      </SettingsSection>

      <p className="text-xs text-center text-muted-foreground">
        AnalizadorFinanzas v1.0.0 · Datos almacenados localmente
      </p>
    </div>
  )
}
