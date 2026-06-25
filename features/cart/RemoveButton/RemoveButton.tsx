'use client'

import clsx from 'clsx'

import styles from './RemoveButton.module.css'

type RemoveButtonProps = {
  ariaLabel: string
  onClick: () => void
  disabled?: boolean
}

export const RemoveButton = ({ ariaLabel, onClick, disabled = false }: RemoveButtonProps) => (
  <button
    type="button"
    className={clsx(styles.remove)}
    aria-label={ariaLabel}
    onClick={onClick}
    disabled={disabled}
  >
    Remove
  </button>
)
