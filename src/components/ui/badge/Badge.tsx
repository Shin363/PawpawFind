import './Badge.css'

interface BadgeProps {
  children: React.ReactNode
}

export function Badge({ children }: BadgeProps) {
  return <span className="ds-badge">{children}</span>
}

export type { BadgeProps }
