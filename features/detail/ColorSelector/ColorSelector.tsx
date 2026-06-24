'use client'

import { type KeyboardEvent, useState } from 'react'

import type { ColorOption } from '@/shared/lib/types/domain'
import clsx from 'clsx'

import styles from './ColorSelector.module.css'

type ColorSelectorProps = {
  options: ColorOption[]
  selectedIndex: number | null
  onSelect: (index: number) => void
}

export const ColorSelector = ({ options, selectedIndex, onSelect }: ColorSelectorProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const displayIndex = hoveredIndex ?? selectedIndex ?? 0
  const displayName = options[displayIndex]?.name ?? null

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (options.length === 0) return
    const current = selectedIndex ?? -1
    let next = current
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      next = (current + 1) % options.length
      event.preventDefault()
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = (current - 1 + options.length) % options.length
      event.preventDefault()
    } else {
      return
    }
    onSelect(next)
  }

  return (
    <div className={styles.container}>
      <p className={styles.label}>Color. Pick your favourite.</p>
      <div
        className={styles.options}
        role="radiogroup"
        aria-label="Color"
        tabIndex={-1}
        onMouseLeave={() => setHoveredIndex(null)}
        onKeyDown={handleKeyDown}
      >
        {options.map((option, index) => {
          const isSelected = index === selectedIndex
          return (
            <button
              key={option.name}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={option.name}
              tabIndex={isSelected || (selectedIndex === null && index === 0) ? 0 : -1}
              className={clsx(styles.swatch, isSelected && styles.selected)}
              style={{ backgroundColor: option.hexCode }}
              onClick={() => onSelect(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onFocus={() => setHoveredIndex(index)}
              onBlur={() => setHoveredIndex(null)}
            >
              <span className={styles.swatchInner} />
            </button>
          )
        })}
      </div>
      <span className={styles.name} aria-live="polite">
        {displayName ?? ''}
      </span>
    </div>
  )
}
