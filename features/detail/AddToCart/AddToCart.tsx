'use client'

import clsx from 'clsx'

import styles from './AddToCart.module.css'

type AddToCartProps = {
  disabled?: boolean
  onAdd: () => void
}

export const AddToCart = ({ disabled = false, onAdd }: AddToCartProps) => (
  <button
    type="button"
    className={clsx(styles.button, disabled && styles.disabled)}
    onClick={onAdd}
    disabled={disabled}
  >
    Add
  </button>
)
