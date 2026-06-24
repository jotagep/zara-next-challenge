import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import '@/test/mocks/next/image'

import { PhoneGallery } from './PhoneGallery'

describe('PhoneGallery', () => {
  it('renders the image with the provided src and alt', () => {
    render(<PhoneGallery imageUrl="https://example.com/x.png" alt="A phone" />)
    const image = screen.getByTestId('next-image')
    expect(image).toHaveAttribute('src', 'https://example.com/x.png')
    expect(image).toHaveAttribute('alt', 'A phone')
  })

  it('defaults priority to true so the hero image loads eagerly', () => {
    render(<PhoneGallery imageUrl="https://example.com/x.png" alt="A phone" />)
    expect(screen.getByTestId('next-image')).toHaveAttribute('data-priority', 'true')
  })

  it('forwards priority=false when the caller opts out', () => {
    render(<PhoneGallery imageUrl="https://example.com/x.png" alt="A phone" priority={false} />)
    expect(screen.getByTestId('next-image')).toHaveAttribute('data-priority', 'false')
  })

  it('forwards priority=true when the caller opts in', () => {
    render(<PhoneGallery imageUrl="https://example.com/x.png" alt="A phone" priority />)
    expect(screen.getByTestId('next-image')).toHaveAttribute('data-priority', 'true')
  })

  it('passes a responsive sizes attribute to next/image', () => {
    render(<PhoneGallery imageUrl="https://example.com/x.png" alt="A phone" />)
    expect(screen.getByTestId('next-image')).toHaveAttribute(
      'data-sizes',
      '(max-width: 1023px) 100vw, (max-width: 1279px) 400px, 510px'
    )
  })
})
