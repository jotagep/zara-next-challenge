import { ROUTES } from '@/shared/config/routes'
import { phoneFixtures } from '@/test/fixtures'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import '@/test/mocks/next/image'

import { PhoneCard } from './PhoneCard'

describe('PhoneCard', () => {
  const phone = phoneFixtures[0]

  it('renders a link to the phone detail page', () => {
    render(<PhoneCard phone={phone} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', ROUTES.phone(phone.id))
  })

  it('shows the brand and name of the phone', () => {
    render(<PhoneCard phone={phone} />)
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument()
  })

  it('shows the formatted price', () => {
    render(<PhoneCard phone={phone} />)
    expect(screen.getByText('1099 EUR')).toBeInTheDocument()
  })

  it('uses brand + name as alt text for the image', () => {
    render(<PhoneCard phone={phone} />)
    expect(screen.getByAltText('Apple iPhone 15 Pro')).toBeInTheDocument()
  })

  it('defaults priority to false on the image', () => {
    render(<PhoneCard phone={phone} />)
    expect(screen.getByTestId('next-image')).toHaveAttribute('data-priority', 'false')
  })

  it('sets priority to true when the priority prop is passed', () => {
    render(<PhoneCard phone={phone} priority />)
    expect(screen.getByTestId('next-image')).toHaveAttribute('data-priority', 'true')
  })

  it('sets loading="lazy" when priority is false', () => {
    render(<PhoneCard phone={phone} />)
    expect(screen.getByTestId('next-image')).toHaveAttribute('loading', 'lazy')
  })

  it('sets loading="eager" when priority is true', () => {
    render(<PhoneCard phone={phone} priority />)
    expect(screen.getByTestId('next-image')).toHaveAttribute('loading', 'eager')
  })
})
