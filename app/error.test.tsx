import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import GlobalError from './error'

describe('GlobalError', () => {
  const error = new Error('boom')
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
    vi.unstubAllEnvs()
  })

  it('renders the title, message and a "Try again" button', () => {
    render(<GlobalError error={error} reset={() => {}} />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Something went wrong' })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/we couldn.+t load the catalog\. please try again\./i)
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })

  describe('error logging', () => {
    it('logs the error in non-production', () => {
      vi.stubEnv('NODE_ENV', 'development')
      render(<GlobalError error={error} reset={() => {}} />)
      expect(consoleErrorSpy).toHaveBeenCalledWith(error)
    })

    it('does not log the error in production', () => {
      vi.stubEnv('NODE_ENV', 'production')
      render(<GlobalError error={error} reset={() => {}} />)
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it('logs the error in test (only production is suppressed)', () => {
      vi.stubEnv('NODE_ENV', 'test')
      render(<GlobalError error={error} reset={() => {}} />)
      expect(consoleErrorSpy).toHaveBeenCalledWith(error)
    })

    it('re-logs the error when the error prop changes', () => {
      vi.stubEnv('NODE_ENV', 'development')
      const { rerender } = render(<GlobalError error={error} reset={() => {}} />)
      const otherError = new Error('second')
      rerender(<GlobalError error={otherError} reset={() => {}} />)
      expect(consoleErrorSpy).toHaveBeenCalledTimes(2)
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(1, error)
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(2, otherError)
    })
  })

  describe('reset', () => {
    it('calls the reset handler when the button is clicked', async () => {
      const user = userEvent.setup()
      const reset = vi.fn()
      render(<GlobalError error={error} reset={reset} />)
      await user.click(screen.getByRole('button', { name: 'Try again' }))
      expect(reset).toHaveBeenCalledTimes(1)
    })

    it('renders the button as enabled (not disabled)', () => {
      render(<GlobalError error={error} reset={() => {}} />)
      expect(screen.getByRole('button', { name: 'Try again' })).not.toBeDisabled()
    })
  })

  it('renders an error with a digest without crashing', () => {
    const withDigest = Object.assign(new Error('boom'), { digest: 'abc123' })
    vi.stubEnv('NODE_ENV', 'production')
    expect(() => render(<GlobalError error={withDigest} reset={() => {}} />)).not.toThrow()
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })
})
