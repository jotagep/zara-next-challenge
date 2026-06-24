import { vi } from 'vitest'

vi.mock('next/image', () => ({
  default: (props: {
    src: string
    alt: string
    priority?: boolean
    className?: string
    sizes?: string
  }) => {
    const { src, alt, priority, className, sizes } = props
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        data-testid="next-image"
        data-priority={priority ? 'true' : 'false'}
        data-sizes={sizes}
        className={className}
      />
    )
  },
}))
