'use client'

import { type MouseEventHandler, type ReactNode } from 'react'
import Link from 'next/link'

import clsx from 'clsx'

import styles from './Button.module.css'

export const BUTTON_VARIANTS = ['primary', 'secondary'] as const
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number]

type SharedButtonProps = {
  children: ReactNode
  className?: string
  variant?: ButtonVariant
}

type ButtonAsButton = SharedButtonProps & {
  href?: undefined
  onClick?: MouseEventHandler<HTMLButtonElement>
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

type ButtonAsLink = SharedButtonProps & {
  href: string
  prefetch?: boolean
}

type ButtonProps = ButtonAsButton | ButtonAsLink

export const Button = (props: ButtonProps) => {
  const { children, className, variant = 'primary' } = props
  const classes = clsx(styles.button, styles[`variant-${variant}`], className)

  if (props.href !== undefined) {
    const { href, prefetch } = props
    return (
      <Link href={href} className={classes} prefetch={prefetch}>
        {children}
      </Link>
    )
  }

  const { onClick, type = 'button', disabled } = props
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  )
}
