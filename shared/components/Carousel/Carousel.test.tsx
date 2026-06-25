import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Carousel } from './Carousel'

const items = ['Alpha', 'Beta', 'Gamma']

describe('Carousel', () => {
  it('renders a list with the provided children', () => {
    render(
      <Carousel aria-label="Similar products">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </Carousel>
    )
    expect(screen.getByRole('list', { name: 'Similar products' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByText('Alpha')).toBeInTheDocument()
  })

  it('renders the children inside a ul element', () => {
    render(
      <Carousel>
        <li>only child</li>
      </Carousel>
    )
    const list = screen.getByRole('list')
    expect(list.tagName).toBe('UL')
  })

  it('does not render the scrollbar thumb when there is no overflow', () => {
    const { container } = render(
      <Carousel>
        <li>x</li>
      </Carousel>
    )
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull()
  })
})
