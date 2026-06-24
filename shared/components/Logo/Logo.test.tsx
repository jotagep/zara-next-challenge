import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Logo } from './Logo'

describe('Logo', () => {
  it('renders an svg element', () => {
    const { container } = render(<Logo />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('exposes an accessible name of "Zara Mobile"', () => {
    render(<Logo />)
    expect(screen.getByRole('img', { name: /zara mobile/i })).toBeInTheDocument()
  })

  it('forwards a provided className to the svg', () => {
    const { container } = render(<Logo className="custom-class" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('custom-class')
  })
})
