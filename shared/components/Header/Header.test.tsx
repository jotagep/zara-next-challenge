import { ROUTES } from '@/shared/config/routes'
import { CartProvider } from '@/shared/context/CartContext'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import '@/test/mocks/next/link'

import { Header } from './Header'

describe('Header', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders a header landmark', () => {
    const { container } = render(
      <CartProvider>
        <Header />
      </CartProvider>
    )
    expect(container.querySelector('header')).toBeInTheDocument()
  })

  it('renders a logo link pointing to home', () => {
    render(
      <CartProvider>
        <Header />
      </CartProvider>
    )
    const homeLink = screen.getByRole('link', { name: 'Home' })
    expect(homeLink).toHaveAttribute('href', ROUTES.home)
  })

  it('renders the bag link pointing to /cart', () => {
    render(
      <CartProvider>
        <Header />
      </CartProvider>
    )
    const bagLink = screen.getByRole('link', { name: /shopping bag, 0 items/i })
    expect(bagLink).toHaveAttribute('href', ROUTES.cart)
  })
})
