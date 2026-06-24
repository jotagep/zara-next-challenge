import { ROUTES } from '@/shared/config/routes'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import '@/test/mocks/next/link'

import { BackLink } from './BackLink'

describe('BackLink', () => {
  it('renders a link pointing to the home route', () => {
    render(<BackLink />)
    const link = screen.getByRole('link', { name: /back/i })
    expect(link).toHaveAttribute('href', ROUTES.home)
  })

  it('renders the "Back" label as visible text', () => {
    render(<BackLink />)
    expect(screen.getByText('Back')).toBeInTheDocument()
  })

  it('renders a decorative chevron svg marked as aria-hidden', () => {
    const { container } = render(<BackLink />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg?.getAttribute('viewBox')).toBe('0 0 20 20')
  })

  it('wraps the link in a Container (so the link is not a direct child of body)', () => {
    const { container } = render(<BackLink />)
    const bar = container.firstChild
    expect(bar).not.toBeNull()
    const link = screen.getByRole('link', { name: /back/i })
    expect(bar?.contains(link)).toBe(true)
    expect(link.parentElement?.parentElement).toBe(bar)
  })
})
