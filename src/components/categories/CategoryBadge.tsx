import { cn } from '@/lib/utils'

interface Props {
  name: string
  icon: string
  color: string
  size?: 'sm' | 'md'
  className?: string
}

export default function CategoryBadge({ name, icon, color, size = 'md', className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        className
      )}
      style={{ backgroundColor: `${color}18`, color }}
    >
      <span>{icon}</span>
      <span>{name}</span>
    </span>
  )
}
