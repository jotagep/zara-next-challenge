'use client'

import { useId } from 'react'

import { ResultsCount } from '@/features/catalog/components/ResultsCount/ResultsCount'

import styles from './SearchInput.module.css'

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  count: number
  isSearching: boolean
}

export const SearchInput = ({ value, onChange, count, isSearching }: SearchInputProps) => {
  const inputId = useId()

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  const handleOnClear = () => {
    onChange('')
  }

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <form role="search" className={styles.container} onSubmit={handleOnSubmit}>
      <label htmlFor={inputId} className={styles.label}>
        Search for a smartphone...
      </label>
      <div className={styles.field}>
        <input
          id={inputId}
          type="search"
          value={value}
          onChange={handleOnChange}
          placeholder="Search for a smartphone..."
          className={styles.input}
          autoComplete="off"
          spellCheck={false}
          aria-describedby={`${inputId}-count`}
        />
        {value && (
          <button
            type="button"
            onClick={handleOnClear}
            aria-label="Clear search"
            className={styles.clear}
          >
            <svg
              viewBox="0 0 12 12"
              aria-hidden="true"
              focusable="false"
              className={styles.clearIcon}
            >
              <path
                d="M1 1 L11 11 M11 1 L1 11"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </button>
        )}
      </div>
      <ResultsCount id={`${inputId}-count`} count={count} isSearching={isSearching} />
    </form>
  )
}
