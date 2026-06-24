import { useState } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SearchInput } from './SearchInput'

describe('SearchInput', () => {
  it('renders a labelled search field', () => {
    render(<SearchInput value="" onChange={() => {}} count={5} isSearching={false} />)
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
    expect(screen.getByLabelText(/search for a smartphone/i)).toBeInTheDocument()
  })

  it('shows the provided results count below the input', () => {
    render(<SearchInput value="" onChange={() => {}} count={5} isSearching={false} />)
    expect(screen.getByText('5 RESULTS')).toBeInTheDocument()
  })

  it('renders the Searching indicator while isSearching', () => {
    render(<SearchInput value="abc" onChange={() => {}} count={5} isSearching />)
    expect(screen.getByText(/searching/i)).toBeInTheDocument()
  })

  it('calls onChange with the cumulative value while typing', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const Controlled = () => {
      const [val, setVal] = useState('')
      return (
        <SearchInput
          value={val}
          onChange={(v) => {
            onChange(v)
            setVal(v)
          }}
          count={0}
          isSearching={false}
        />
      )
    }
    render(<Controlled />)
    await user.type(screen.getByRole('searchbox'), 'iphone')
    expect(onChange).toHaveBeenLastCalledWith('iphone')
  })

  it('hides the clear button when the value is empty', () => {
    render(<SearchInput value="" onChange={() => {}} count={0} isSearching={false} />)
    expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument()
  })

  it('shows the clear button when the value is non-empty', () => {
    render(<SearchInput value="abc" onChange={() => {}} count={0} isSearching={false} />)
    expect(screen.getByRole('button', { name: /clear search/i })).toBeInTheDocument()
  })

  it('calls onChange with an empty string when the clear button is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SearchInput value="abc" onChange={onChange} count={0} isSearching={false} />)
    await user.click(screen.getByRole('button', { name: /clear search/i }))
    expect(onChange).toHaveBeenCalledWith('')
  })
})
