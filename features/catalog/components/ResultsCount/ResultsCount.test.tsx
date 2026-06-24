import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ResultsCount } from './ResultsCount'

describe('ResultsCount', () => {
  it('shows "Searching…" while a search is in flight', () => {
    render(<ResultsCount count={10} isSearching />)
    expect(screen.getByText(/searching/i)).toBeInTheDocument()
  })

  it('renders the singular form for a single result', () => {
    render(<ResultsCount count={1} isSearching={false} />)
    expect(screen.getByText('1 RESULT')).toBeInTheDocument()
  })

  it('renders the plural form for multiple results', () => {
    render(<ResultsCount count={3} isSearching={false} />)
    expect(screen.getByText('3 RESULTS')).toBeInTheDocument()
  })

  it('renders 0 in the plural form for an empty catalog', () => {
    render(<ResultsCount count={0} isSearching={false} />)
    expect(screen.getByText('0 RESULTS')).toBeInTheDocument()
  })
})
