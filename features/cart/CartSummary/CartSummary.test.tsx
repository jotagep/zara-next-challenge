import { ROUTES } from '@/shared/config/routes'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import '@/test/mocks/next/link'

import { CartSummary } from './CartSummary'

describe('CartSummary', () => {
  it('renders as a footer', () => {
    const { container } = render(<CartSummary total={0} />)
    expect(container.querySelector('footer')).not.toBeNull()
  })

  it('renders a "Continue shopping" link pointing to the home route', () => {
    render(<CartSummary total={0} />)
    const link = screen.getByRole('link', { name: 'Continue shopping' })
    expect(link).toHaveAttribute('href', ROUTES.home)
  })

  it('renders the total label and the formatted total amount', () => {
    render(<CartSummary total={1234} />)
    expect(screen.getByText('Total')).toBeInTheDocument()
    expect(screen.getByText('1234 EUR')).toBeInTheDocument()
  })

  it('formats a zero total as "0 EUR"', () => {
    render(<CartSummary total={0} />)
    expect(screen.getByText('0 EUR')).toBeInTheDocument()
  })

  it('formats large totals without modifying the numeric value', () => {
    render(<CartSummary total={9999.5} />)
    expect(screen.getByText('9999.5 EUR')).toBeInTheDocument()
  })

  it('renders a "Pay" button of type="button"', () => {
    render(<CartSummary total={0} />)
    const pay = screen.getByRole('button', { name: 'Pay' })
    expect(pay.tagName).toBe('BUTTON')
    expect(pay).toHaveAttribute('type', 'button')
  })

  it('renders the home link, the total and the pay button in that order', () => {
    const { container } = render(<CartSummary total={50} />)
    const footer = container.querySelector('footer')
    expect(footer).not.toBeNull()
    const directChildren = Array.from(footer?.children ?? [])
    expect(directChildren[0]).toBe(screen.getByRole('link', { name: 'Continue shopping' }))
    expect(directChildren[1]).toBe(screen.getByText((_c, el) => el?.tagName === 'P'))
    expect(directChildren[2]).toBe(screen.getByRole('button', { name: 'Pay' }))
  })
})
