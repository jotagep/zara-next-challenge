'use client'

import { type KeyboardEvent } from 'react'

import type { StorageOption } from '@/shared/lib/types/domain'
import clsx from 'clsx'

import styles from './StorageSelector.module.css'

type StorageSelectorProps = {
  options: StorageOption[]
  selectedIndex: number | null
  onSelect: (index: number) => void
}

export const StorageSelector = ({ options, selectedIndex, onSelect }: StorageSelectorProps) => {
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
      <p className={styles.label}>Storage. How much space do you need?</p>
      <div
        className={styles.options}
        role="radiogroup"
        aria-label="Storage"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        {options.map((option, index) => {
          const isSelected = index === selectedIndex
          return (
            <button
              key={option.capacity}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected || (selectedIndex === null && index === 0) ? 0 : -1}
              className={clsx(styles.option, isSelected && styles.selected)}
              onClick={() => onSelect(index)}
            >
              {option.capacity}
            </button>
          )
        })}
      </div>
    </div>
  )
}
