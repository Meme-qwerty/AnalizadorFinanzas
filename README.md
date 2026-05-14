# AnalizadorFinanzas

Una aplicación web moderna y completa para la gestión y análisis de finanzas personales, construida con Next.js 16, React 19 y TypeScript.

[Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
[License](https://img.shields.io/badge/license-MIT-green.svg)
[Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

## Tabla de Contenidos
- [Características Principales]
- [Tecnologías]
- [Requisitos Previos]
- [Instalación]
- [Configuración]
- [Scripts Disponibles]
- [Estructura del Proyecto]
- [Arquitectura]
- [Características Detalladas]
- [API y Servicios]
- [Tipos y Interfaces]
- [Hooks Personalizados]
- [Almacenamiento de Estado]
- [Guía de Contribución]

## Características Principales
### Dashboard Inteligente
- **Resumen Financiero**: Visualización instantánea de balance total, ingresos, gastos y ahorros mensuales
- **Gráficos de Flujo de Caja**: Análisis visual del movimiento de dinero
- **Puntuación de Salud Financiera**: Indicador completo del estado financiero basado en múltiples métricas
- **Transacciones Recientes**: Listado actualizado de últimos movimientos

### Gestión de Presupuestos
- Crear presupuestos por categoría con límites mensuales, trimestrales o anuales
- Monitoreo en tiempo real del gasto vs presupuesto
- Alertas de umbral cuando se acerca el límite
- Indicadores visuales de sobre-gasto
- Edición y eliminación de presupuestos

### Análisis Avanzado
- **Estadísticas Mensuales**: Ingresos, gastos y tasa de ahorro histórica
- **Análisis por Categoría**: Distribución de gastos y tendencias
- **Heatmap de Gastos**: Visualización de patrones de gasto por día/mes
- **Proyecciones**: Predicciones de gastos futuros
- **Comparativa Año a Año**: Análisis YoY para detectar tendencias
- **Top Comercios**: Identificación de principales puntos de gasto
- **Patrimonio Neto**: Seguimiento de activos y patrimonio

### Importación de Datos
- Importar transacciones desde archivos CSV
- Mapeador de columnas flexible para diferentes formatos
- Validación de datos automática
- Visualización de resultados de importación

### Gestión de Metas
- Crear metas de ahorro con objetivos y fechas
- Seguimiento del progreso hacia metas
- Visualización de avance

### Categorías y Reglas
- Sistema flexible de categorías personalizables
- Iconos y colores asignables a cada categoría
- **Reglas Automáticas**: Categorización automática basada en palabras clave
- Facilita organización automática de transacciones

### Gestión de Cuentas
- Múltiples cuentas (ahorros, corriente, etc.)
- Balance por cuenta
- Historial de movimientos por cuenta

### Generación de Reportes
- Exportación de transacciones a CSV
- Reportes por categoría
- Reportes de flujo mensual
- Descarga de histórico de exportaciones

### Configuración y Preferencias
- **Modo Privacidad**: Ocultar montos de dinero en pantalla
- **Gestión de Suscripciones**: Seguimiento de suscripciones recurrentes
- **Notificaciones**: Sistema de alertas personalizables
- **Onboarding Guiado**: Asistente de configuración inicial

### Experiencia de Usuario Premium
- **Búsqueda Global**: Búsqueda rápida en toda la aplicación
- **Atajos de Teclado**: Atajos para operaciones comunes
- **Agregar Transacción Rápida**: Modal para añadir transacciones al instante
- **Transiciones Suaves**: Animaciones con Framer Motion
- **Dark Mode/Light Mode**: Soporte para tema oscuro y claro
- **Responsive Design**: Diseño adaptativo para todos los dispositivos
- **Tabla de Notificaciones**: Panel de alarmas y alertas

## Tecnologías
### Frontend
- **Next.js Framework React con SSR
- **React Librería UI moderna
- **TypeScript 5 Tipado estático para JavaScript
- **Tailwind CSS Utilidades CSS
- **Radix UI Componentes sin estilos accesibles
- **Recharts Gráficos React

### State Management y Data Fetching
- **Zustand State management ligero
- **React Query Gestión de datos asincronos y caché
- **React Hook Form Gestión de formularios eficiente

### Utilitarios
- **Zod Validación de esquemas TypeScript
- **date-fns Manipulación de fechas
- **Axios Cliente HTTP
- **Framer Motion Animaciones
- **Sonner Notificaciones tipo toast
- **PapaParse Parser de CSV

### UI y Diseño
- **CVA Utilidad para variantes de componentes
- **clsx Utilidad para nombres de clases condicionales
- **lucide-react Iconos SVG

### Herramientas de Desarrollo
- **PostCSS Transformación de CSS
- **ESLint** - Linting de código

## Requisitos Previos
Asegúrate de tener instalado:

- **Node.js**: v18.0.0 o superior
- **npm**: v9.0.0 o superior (o yarn/pnpm)
- **Git**: Para control de versiones

## Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/usuario/AnalizadorFinanzas.git
cd AnalizadorFinanzas
```

2. **Instalar dependencias**
```bash
npm install
# o con yarn
yarn install
# o con pnpm
pnpm install
```

3. **Configurar variables de entorno**
```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# Editar .env.local con tus configuraciones
```

## Configuración
### Variables de Entorno

Crear archivo `.env.local` con las siguientes variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Autenticación
NEXT_PUBLIC_AUTH_PROVIDER=local

# Base de datos (si aplica)
DATABASE_URL=postgresql://user:password@localhost:5432/analizador_finanzas

# Otras configuraciones
NODE_ENV=development
```

### Configuración de TypeScript
El proyecto está configurado en `tsconfig.json` con:
- Target: ES2017
- Strict mode activado
- Path alias: `@/*` → `./src/*`
- Módulos ESM

### Configuración de Tailwind CSS
Configuración en `tailwind.config.ts` (si existe):
- Tema personalizado con colores de categorías
- Variables CSS para dinámico
- Soporte para dark mode

## Scripts Disponibles
```bash
# Desarrollo
npm run dev
# Inicia servidor en http://localhost:3000

# Build
npm run build
# Crea compilación optimizada para producción

# Producción
npm start
# Inicia servidor con build de producción

# Linting
npm run lint
# Verifica errores de código
```

## Estructura del Proyecto
```
src/
├── app/                          # App Router de Next.js
│   ├── (auth)/                   # Rutas de autenticación
│   │   ├── login/                # Página de login
│   │   └── register/             # Página de registro
│   ├── (dashboard)/              # Rutas protegidas del dashboard
│   │   ├── accounts/             # Gestión de cuentas
│   │   ├── analytics/            # Análisis avanzado
│   │   ├── budgets/              # Presupuestos
│   │   ├── calendar/             # Calendario de transacciones
│   │   ├── categories/           # Gestión de categorías
│   │   ├── dashboard/            # Dashboard principal
│   │   ├── goals/                # Metas de ahorro
│   │   ├── health/               # Puntuación de salud
│   │   ├── imports/              # Importación de datos
│   │   ├── net-worth/            # Patrimonio neto
│   │   ├── notifications/        # Centro de notificaciones
│   │   ├── onboarding/           # Asistente inicial
│   │   ├── reports/              # Generación de reportes
│   │   ├── rules/                # Reglas automáticas
│   │   ├── settings/             # Configuración
│   │   ├── subscriptions/        # Suscripciones
│   │   └── transactions/         # Gestión de transacciones
│   ├── layout.tsx                # Layout raíz
│   ├── page.tsx                  # Página principal
│   └── globals.css               # Estilos globales
│
├── components/                   # Componentes React reutilizables
│   ├── analytics/                # Componentes de análisis
│   │   ├── ExpenseProjection.tsx
│   │   ├── SpendingHeatmap.tsx
│   │   └── YoYComparison.tsx
│   ├── budgets/                  # Componentes de presupuestos
│   │   ├── BudgetCard.tsx
│   │   └── BudgetForm.tsx
│   ├── categories/               # Componentes de categorías
│   │   ├── CategoryBadge.tsx
│   │   ├── CategoryForm.tsx
│   │   └── CategoryGrid.tsx
│   ├── dashboard/                # Componentes del dashboard
│   │   ├── CashFlowChart.tsx
│   │   ├── FinancialHealthScore.tsx
│   │   ├── RecentTransactions.tsx
│   │   ├── SpendingChart.tsx
│   │   └── SummaryCards.tsx
│   ├── imports/                  # Componentes de importación
│   │   ├── ImportColumnMapper.tsx
│   │   ├── ImportDropzone.tsx
│   │   └── ImportResult.tsx
│   ├── layout/                   # Componentes de layout
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   ├── shared/                   # Componentes compartidos
│   │   ├── GlobalSearch.tsx
│   │   ├── KeyboardShortcutsDialog.tsx
│   │   ├── PageTransition.tsx
│   │   ├── QuickAddTransaction.tsx
│   │   └── ThemeProvider.tsx
│   ├── transactions/             # Componentes de transacciones
│   ├── ui/                       # Componentes UI base (Radix)
│   │   ├── alert-dialog.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── progress.tsx
│   │   ├── select.tsx
│   │   ├── skeleton.tsx
│   │   ├── tabs.tsx
│   │   ├── table.tsx
│   │   └── ...más componentes
│   ├── Providers.tsx             # Provider de contexto global
│   └── ThemeProvider.tsx         # Provider de tema
│
├── hooks/                        # Hooks personalizados
│   ├── useAccounts.ts            # Gestión de cuentas
│   ├── useAnalytics.ts           # Datos de análisis
│   ├── useBudgets.ts             # Gestión de presupuestos
│   ├── useCategories.ts          # Categorías
│   ├── useGoals.ts               # Metas
│   ├── useKeyboardShortcut.ts    # Atajos de teclado
│   ├── usePrivacyMode.ts         # Modo privacidad
│   ├── useRules.ts               # Reglas automáticas
│   ├── useSubscriptions.ts       # Suscripciones
│   └── useTransactions.ts        # Transacciones
│
├── services/                     # Servicios de API/Negocio
│   ├── accounts.service.ts
│   ├── analytics.service.ts
│   ├── auth.service.ts
│   ├── budgets.service.ts
│   ├── categories.service.ts
│   ├── goals.service.ts
│   ├── imports.service.ts
│   ├── rules.service.ts
│   ├── subscriptions.service.ts
│   └── transactions.service.ts
│
├── store/                        # Zustand stores (estado global)
│   ├── auth.store.ts             # Estado de autenticación
│   ├── notifications.store.ts    # Estado de notificaciones
│   ├── privacy.store.ts          # Estado de modo privacidad
│   ├── theme.store.ts            # Estado de tema
│   └── ui.store.ts               # Estado de UI
│
├── lib/                          # Utilidades y helpers
│   ├── api.ts                    # Configuración de cliente HTTP
│   ├── constants.ts              # Constantes de la app
│   ├── formatters.ts             # Formatos (dinero, fecha, etc)
│   ├── utils.ts                  # Funciones auxiliares
│   └── validators.ts             # Esquemas Zod de validación
│
├── types/                        # Interfaces y tipos TypeScript
│   ├── account.types.ts          # Tipos de cuentas
│   ├── analytics.types.ts        # Tipos de análisis
│   ├── api.types.ts              # Tipos de API
│   ├── budget.types.ts           # Tipos de presupuestos
│   ├── category.types.ts         # Tipos de categorías
│   ├── goal.types.ts             # Tipos de metas
│   ├── import.types.ts           # Tipos de importación
│   ├── notification.types.ts     # Tipos de notificaciones
│   └── transaction.types.ts      # Tipos de transacciones
│
├── components.json               # Configuración de UI components
├── next-env.d.ts                 # Tipos de Next.js
├── package.json                  # Dependencias del proyecto
├── postcss.config.mjs            # Configuración PostCSS
├── tsconfig.json                 # Configuración TypeScript
└── README.md                     # Este archivo
```

## Arquitectura
### Patrón de Estructura
El proyecto sigue una arquitectura de **componentes + servicios** con clara separación de responsabilidades:

```
┌─────────────────────────────────────────┐
│         UI Components                   │
│  (pages, components, layouts)           │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│     Custom Hooks + State Management     │
│  (useQuery, Zustand stores)             │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│         Services Layer                  │
│  (API calls, business logic)            │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│       HTTP Client (Axios)               │
│    Environment Configuration            │
└─────────────────────────────────────────┘
```

### Data Flow
1. **UI Components** → Renderiza y captura interacción de usuario
2. **Custom Hooks** → Gestiona queries con React Query
3. **Services** → Realiza llamadas a API
4. **State Stores** → Zustand maneja estado global (auth, tema, privacidad)
5. **Types** → Todo tipado con TypeScript para seguridad

### Flujo de Datos Unidireccional
```
User Action → Hook Query → Service → API → Response → Store → Rerender
```

## Características Detalladas
### Dashboard Principal 
- **Resumen de Tarjetas**: Balance, ingresos, gastos, ahorros del mes actual
- **Gráfico de Flujo de Caja**: Área con ingresos y gastos históricos
- **Gráfico de Gastos**: Pie chart de distribución por categoría
- **Puntuación de Salud Financiera**: Indicador con métricas clave
- **Transacciones Recientes**: Tabla de últimos movimientos

### Analítica 
- **Resumen**: KPIs principales (tasa ahorro, mejor mes, categorías activas)
- **Gráficos Mensuales**: Ingresos y gastos por mes
- **Distribución por Categoría**: Pie charts de gasto
- **Top Comercios**: Barras de comercios con mayor gasto
- **Proyecciones**: Predicción de gastos futuros
- **Heatmap**: Visualización de intensidad de gasto
- **Comparativa YoY**: Comparación año a año

### Presupuestos 
- Crear presupuestos por categoría
- Monitoreo visual del progreso
- Editar y eliminar presupuestos
- Alertas de sobre-gasto
- Total presupuestado vs gastado

### Importación 
- Carga de archivos CSV
- Mapeador de columnas flexible
- Validación de datos
- Previsualización de importación
- Historial de importaciones

### Reportes 
- Exportar transacciones a CSV
- Reporte de gastos por categoría
- Reporte de flujo mensual
- Descarga de histórico

## API y Servicios
### Servicios Disponibles
Cada servicio proporciona métodos para interactuar con datos:
```typescript
// Analytics Service
analyticsService.getDashboardSummary()
analyticsService.getMonthlyStats(months)
analyticsService.getCategoryStats()
analyticsService.getTopMerchants()
analyticsService.getNetWorthHistory()

// Budgets Service
budgetsService.getBudgets()
budgetsService.createBudget(data)
budgetsService.updateBudget(id, data)
budgetsService.deleteBudget(id)

// Transactions Service
transactionsService.getTransactions(filters)
transactionsService.createTransaction(data)
transactionsService.updateTransaction(id, data)
transactionsService.deleteTransaction(id)

// Y más servicios...
```

### Cliente HTTP (Axios)
Configurado en `lib/api.ts` con:
- Base URL del API
- Interceptores de autenticación
- Manejo de errores centralizado
- Timeout configurables

## Tipos y Interfaces
Todos los tipos están definidos en `src/types/` para máxima type-safety:
```typescript
// Transacciones
interface Transaction {
  id: string
  userId: string
  accountId: string
  categoryId: string
  description: string
  amount: number
  type: 'income' | 'expense'
  currency: string
  occurredAt: Date
  createdAt: Date
}

// Presupuestos
interface Budget {
  id: string
  userId: string
  categoryId: string
  amount: number
  period: 'monthly' | 'quarterly' | 'annual' | 'custom'
  startDate: Date
  endDate: Date
  alertThresholds: number[]
  createdAt: Date
}

// Y más tipos...
```

## 🪝 Hooks Personalizados

### useTransactions
```typescript
const { data: transactions, isLoading } = useTransactions({ 
  startDate, 
  endDate, 
  categoryId 
})
```

### useBudgets
```typescript
const { data: budgets } = useBudgets()
const createBudget = useCreateBudget()
const updateBudget = useUpdateBudget()
const deleteBudget = useDeleteBudget()
```

### useAnalytics
```typescript
const { data: summary } = useDashboardSummary()
const { data: monthly } = useMonthlyStats(12)
const { data: categories } = useCategoryStats()
```

### usePrivacyMode
```typescript
const { isPrivate, maskAmount } = usePrivacyMode()
```

## Almacenamiento de Estado
### Zustand Stores
**Auth Store**: Autenticación del usuario
```typescript
const { user, isLoading, login, logout } = useAuthStore()
```

**Theme Store**: Preferencia de tema
```typescript
const { theme, toggleTheme } = useThemeStore()
```

**Privacy Store**: Modo privacidad
```typescript
const { isPrivate, togglePrivacy } = usePrivacyStore()
```

**Notifications Store**: Notificaciones globales
```typescript
const { notifications, addNotification } = useNotificationsStore()
```

**UI Store**: Estado de UI
```typescript
const { sidebarOpen, toggleSidebar } = useUIStore()
```

## Guía de Contribución
### Configurar para Desarrollo
1. Fork el repositorio
2. Crea una rama para tu feature: `git checkout -b feature/nueva-caracteristica`
3. Realiza tus cambios
4. Commit tus cambios: `git commit -am 'Añade nueva característica'`
5. Push a la rama: `git push origin feature/nueva-caracteristica`
6. Abre un Pull Request

## Licencia
Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Roadmap
- [ ] Integración con bancos reales
- [ ] Exportación a PDF de reportes
- [ ] Machine Learning para categorización automática
- [ ] API REST pública
- [ ] Aplicación móvil
- [ ] Sincronización en tiempo real
- [ ] Análisis predictivo avanzado
- [ ] Sistema de referencias
