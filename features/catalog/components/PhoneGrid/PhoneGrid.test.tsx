import { PRIORITY_CARD_COUNT } from '@/features/catalog/constants'
import { ROUTES } from '@/shared/config/routes'
import { phoneFixtures } from '@/test/fixtures'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import '@/test/mocks/next/image'

import { PhoneGrid } from './PhoneGrid'

describe('PhoneGrid', () => {
  it('renders an empty-state message when there are no phones', () => {
    render(<PhoneGrid phones={[]} />)
    expect(screen.getByText(/no smartphones match your search/i)).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('renders one link per phone', () => {
    render(<PhoneGrid phones={phoneFixtures} />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(phoneFixtures.length)
    expect(links[0]).toHaveAttribute('href', ROUTES.phone(phoneFixtures[0].id))
    expect(links[1]).toHaveAttribute('href', ROUTES.phone(phoneFixtures[1].id))
    expect(links[2]).toHaveAttribute('href', ROUTES.phone(phoneFixtures[2].id))
  })

  it('marks the first PRIORITY_CARD_COUNT cards as priority', () => {
    render(<PhoneGrid phones={phoneFixtures} />)
    const images = screen.getAllByTestId('next-image')
    images.forEach((image, index) => {
      const expected = index < PRIORITY_CARD_COUNT ? 'true' : 'false'
      expect(image).toHaveAttribute('data-priority', expected)
    })
  })
})
