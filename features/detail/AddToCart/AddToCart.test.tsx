import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { AddToCart } from './AddToCart'

describe('AddToCart', () => {
  it('renders with the "Añadir" label', () => {
    render(<AddToCart onAdd={() => {}} />)
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument()
  })

  it('is disabled when the disabled prop is true', () => {
    render(<AddToCart disabled onAdd={() => {}} />)
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled()
  })

  it('is enabled by default', () => {
    render(<AddToCart onAdd={() => {}} />)
    expect(screen.getByRole('button', { name: /add/i })).toBeEnabled()
  })

  it('calls onAdd when clicked', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<AddToCart onAdd={onAdd} />)
    await user.click(screen.getByRole('button', { name: /add/i }))
    expect(onAdd).toHaveBeenCalledTimes(1)
  })

  it('does not call onAdd when disabled', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<AddToCart disabled onAdd={onAdd} />)
    await user.click(screen.getByRole('button', { name: /add/i }))
    expect(onAdd).not.toHaveBeenCalled()
  })
})
