import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PhoneGridSkeleton } from './PhoneGridSkeleton'

describe('PhoneGridSkeleton', () => {
  it('renders the default number of placeholder cards (6)', () => {
    const { container } = render(<PhoneGridSkeleton />)
    const grid = container.firstElementChild as HTMLElement
    expect(grid).not.toBeNull()
    expect(grid.children).toHaveLength(6)
  })

  it('renders a custom number of cards when count is provided', () => {
    const { container } = render(<PhoneGridSkeleton count={3} />)
    const grid = container.firstElementChild as HTMLElement
    expect(grid.children).toHaveLength(3)
  })

  it('is hidden from assistive technology', () => {
    const { container } = render(<PhoneGridSkeleton />)
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })
})
