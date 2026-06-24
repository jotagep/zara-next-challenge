import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Container } from './Container'

describe('Container', () => {
  it('renders its children', () => {
    render(
      <Container>
        <p>hello</p>
      </Container>
    )
    expect(screen.getByText('hello')).toBeInTheDocument()
  })

  it('renders a div as the wrapper element', () => {
    const { container } = render(<Container>content</Container>)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('applies the default size class when size is omitted', () => {
    const { container } = render(<Container>content</Container>)
    expect(container.firstChild).toHaveClass(/size-default/)
  })

  it('applies the narrow size class', () => {
    const { container } = render(<Container size="narrow">content</Container>)
    expect(container.firstChild).toHaveClass(/size-narrow/)
    expect(container.firstChild).not.toHaveClass(/size-default/)
    expect(container.firstChild).not.toHaveClass(/size-wide/)
  })

  it('applies the wide size class', () => {
    const { container } = render(<Container size="wide">content</Container>)
    expect(container.firstChild).toHaveClass(/size-wide/)
    expect(container.firstChild).not.toHaveClass(/size-default/)
    expect(container.firstChild).not.toHaveClass(/size-narrow/)
  })

  it('merges a custom className', () => {
    const { container } = render(<Container className="my-custom-class">content</Container>)
    expect(container.firstChild).toHaveClass('my-custom-class')
    expect(container.firstChild).toHaveClass(/size-default/)
  })
})
