import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ColorSelector } from './ColorSelector'

const options = [
  { name: 'Black Titanium', hexCode: '#62605F', imageUrl: 'https://example.com/black.png' },
  { name: 'Blue Titanium', hexCode: '#4D4E5F', imageUrl: 'https://example.com/blue.png' },
  { name: 'Natural Titanium', hexCode: '#ACA49B', imageUrl: 'https://example.com/natural.png' },
]

describe('ColorSelector', () => {
  it('renders one radio per color, labelled by color name', () => {
    render(<ColorSelector options={options} selectedIndex={null} onSelect={() => {}} />)
    expect(screen.getByRole('radio', { name: 'Black Titanium' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Blue Titanium' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Natural Titanium' })).toBeInTheDocument()
  })

  it('shows the first colour name by default when nothing is selected or hovered', () => {
    render(<ColorSelector options={options} selectedIndex={null} onSelect={() => {}} />)
    expect(screen.getByText('Black Titanium')).toBeInTheDocument()
  })

  it('shows the colour name when an option is selected', () => {
    render(<ColorSelector options={options} selectedIndex={0} onSelect={() => {}} />)
    expect(screen.getByText('Black Titanium')).toBeInTheDocument()
  })

  it('calls onSelect with the clicked index', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<ColorSelector options={options} selectedIndex={null} onSelect={onSelect} />)
    await user.click(screen.getByRole('radio', { name: 'Blue Titanium' }))
    expect(onSelect).toHaveBeenCalledWith(1)
  })
})
