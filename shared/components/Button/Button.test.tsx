import { ROUTES } from '@/shared/config/routes'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import '@/test/mocks/next/link'

import { Button } from './Button'

describe('Button', () => {
  it('renders a <button> with the default type "button"', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button.tagName).toBe('BUTTON')
    expect(button).toHaveAttribute('type', 'button')
  })

  it('respects an explicit type', () => {
    render(<Button type="submit">Send</Button>)
    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute('type', 'submit')
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Send</Button>)
    await user.click(screen.getByRole('button', { name: 'Send' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        Send
      </Button>
    )
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Send' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders an anchor when an href is provided', () => {
    render(<Button href={ROUTES.cart}>Open cart</Button>)
    const link = screen.getByRole('link', { name: 'Open cart' })
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', ROUTES.cart)
  })

  it('forwards the prefetch option when rendered as a link', () => {
    render(
      <Button href={ROUTES.cart} prefetch={false}>
        Open cart
      </Button>
    )
    expect(screen.getByRole('link', { name: 'Open cart' })).toHaveAttribute(
      'data-prefetch',
      'false'
    )
  })

  it('applies a custom className', () => {
    render(<Button className="my-class">Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toHaveClass('my-class')
  })
})
