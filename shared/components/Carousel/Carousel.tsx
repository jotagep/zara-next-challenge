'use client'

import type { ReactNode } from 'react'

import { useCarousel } from '@/shared/hooks/useCarousel'
import clsx from 'clsx'

import styles from './Carousel.module.css'

type CarouselProps = {
  children: ReactNode
  className?: string
  bleed?: boolean
  'aria-label'?: string
}

export const Carousel = ({
  children,
  className,
  bleed = false,
  'aria-label': ariaLabel,
}: CarouselProps) => {
  const { ref, thumb } = useCarousel<HTMLUListElement>()

  return (
    <div className={styles.carouselWrapper}>
      <ul
        ref={ref}
        className={clsx(styles.carouselList, bleed && styles.carouselListBleed, className)}
        aria-label={ariaLabel}
      >
        {children}
      </ul>
      {thumb.visible ? (
        <div className={styles.carouselScrollbar} aria-hidden="true">
          <span
            className={styles.carouselScrollbarThumb}
            style={{ width: `${thumb.width}%`, left: `${thumb.left}%` }}
          />
        </div>
      ) : null}
    </div>
  )
}
