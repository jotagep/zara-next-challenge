import { useState } from 'react'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { StorageSelector } from './StorageSelector'

const options = [
  { capacity: '128 GB', price: 799 },
  { capacity: '256 GB', price: 899 },
  { capacity: '512 GB', price: 1099 },
]

describe('StorageSelector', () => {
  it('renders all options with their capacity labels', () => {
    render(<StorageSelector options={options} selectedIndex={null} onSelect={() => {}} />)
    expect(screen.getByRole('radio', { name: '128 GB' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '256 GB' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '512 GB' })).toBeInTheDocument()
  })

  it('marks the selected option as checked', () => {
    render(<StorageSelector options={options} selectedIndex={1} onSelect={() => {}} />)
    expect(screen.getByRole('radio', { name: '256 GB' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: '128 GB' })).toHaveAttribute('aria-checked', 'false')
  })

  it('calls onSelect with the clicked index', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<StorageSelector options={options} selectedIndex={null} onSelect={onSelect} />)
    await user.click(screen.getByRole('radio', { name: '512 GB' }))
    expect(onSelect).toHaveBeenCalledWith(2)
  })

  it('navigates with arrow keys', async () => {
    const user = userEvent.setup()
    const ControlledSelector = () => {
      const [selected, setSelected] = useState<number | null>(1)
      return <StorageSelector options={options} selectedIndex={selected} onSelect={setSelected} />
    }
    render(<ControlledSelector />)
    const group = screen.getByRole('radiogroup')
    group.focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: '512 GB' })).toHaveAttribute('aria-checked', 'true')
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: '128 GB' })).toHaveAttribute('aria-checked', 'true')
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('radio', { name: '512 GB' })).toHaveAttribute('aria-checked', 'true')
  })
})
