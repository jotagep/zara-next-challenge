import { ROUTES, SEARCH_PARAM } from '@/shared/config/routes'
import { emptyPhoneFixtures, phoneFixtures } from '@/test/fixtures'
import { nav, resetNav } from '@/test/mocks/next/navigation'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { CatalogClient } from './CatalogClient'

describe('CatalogClient', () => {
  beforeEach(resetNav)

  it('renders the search input, the phone grid and the results count', () => {
    render(<CatalogClient initialPhones={phoneFixtures} />)
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(3)
    expect(screen.getByText('3 RESULTS')).toBeInTheDocument()
  })

  it('renders the empty-state message when there are no initial phones', () => {
    render(<CatalogClient initialPhones={emptyPhoneFixtures} />)
    expect(screen.getByText(/no smartphones match your search/i)).toBeInTheDocument()
    expect(screen.getByText('0 RESULTS')).toBeInTheDocument()
  })

  it('does not call router.replace on mount for an empty search', () => {
    render(<CatalogClient initialPhones={phoneFixtures} />)
    expect(nav.replace).not.toHaveBeenCalled()
  })

  it('shows the Searching indicator while the input value differs from the URL', async () => {
    const user = userEvent.setup()
    render(<CatalogClient initialPhones={phoneFixtures} />)
    await user.type(screen.getByRole('searchbox'), 'galaxy')
    expect(screen.getByText(/searching/i)).toBeInTheDocument()
  })

  it('debounces and calls router.replace with the search term after the debounce window', async () => {
    render(<CatalogClient initialPhones={phoneFixtures} />)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'galaxy' } })
    expect(nav.replace).not.toHaveBeenCalled()
    await waitFor(() => {
      expect(nav.replace).toHaveBeenCalledWith(ROUTES.catalog({ search: 'galaxy' }), {
        scroll: false,
      })
    })
  })

  it('keeps showing the initial phone grid while the search indicator is on', async () => {
    const user = userEvent.setup()
    render(<CatalogClient initialPhones={phoneFixtures} />)
    await user.type(screen.getByRole('searchbox'), 'galaxy')
    expect(screen.getByText(/searching/i)).toBeInTheDocument()
    expect(screen.getAllByRole('link')).toHaveLength(3)
  })

  it('removes the search param when the input is cleared from a populated URL', async () => {
    nav.search = `${SEARCH_PARAM}=galaxy`
    render(<CatalogClient initialPhones={phoneFixtures} />)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '' } })
    await waitFor(() => {
      expect(nav.replace).toHaveBeenLastCalledWith(ROUTES.home, { scroll: false })
    })
  })
})
