import { vi } from 'vitest'

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
    'aria-label': ariaLabel,
    prefetch,
  }: {
    href: string
    children: React.ReactNode
    className?: string
    'aria-label'?: string
    prefetch?: boolean
  }) => (
    <a href={href} className={className} aria-label={ariaLabel} data-prefetch={prefetch}>
      {children}
    </a>
  ),
}))
