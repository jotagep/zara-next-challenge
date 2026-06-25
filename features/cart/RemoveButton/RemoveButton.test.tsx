import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { RemoveButton } from './RemoveButton'

describe('RemoveButton', () => {
  it('renders a button with type="button" and the "Remove" label', () => {
    render(<RemoveButton ariaLabel="Remove item" onClick={() => {}} />)
    const button = screen.getByRole('button', { name: 'Remove item' })
    expect(button.tagName).toBe('BUTTON')
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveTextContent('Remove')
  })

  it('forwards the ariaLabel to the rendered button', () => {
    render(<RemoveButton ariaLabel="Remove iPhone 15 Pro from cart" onClick={() => {}} />)
    expect(
      screen.getByRole('button', { name: 'Remove iPhone 15 Pro from cart' })
    ).toBeInTheDocument()
  })

  it('calls onClick once when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<RemoveButton ariaLabel="Remove item" onClick={onClick} />)
    await user.click(screen.getByRole('button', { name: 'Remove item' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<RemoveButton ariaLabel="Remove item" onClick={onClick} disabled />)
    const button = screen.getByRole('button', { name: 'Remove item' })
    expect(button).toBeDisabled()
    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('is enabled by default when disabled prop is omitted', () => {
    render(<RemoveButton ariaLabel="Remove item" onClick={() => {}} />)
    expect(screen.getByRole('button', { name: 'Remove item' })).not.toBeDisabled()
  })

  it('supports keyboard activation (Enter)', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<RemoveButton ariaLabel="Remove item" onClick={onClick} />)
    const button = screen.getByRole('button', { name: 'Remove item' })
    button.focus()
    await user.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
