'use client'

import { type MouseEventHandler, type ReactNode } from 'react'
import Link from 'next/link'

import clsx from 'clsx'

import styles from './Button.module.css'

type ButtonAsButton = {
  children: ReactNode
  className?: string
  href?: undefined
  onClick?: MouseEventHandler<HTMLButtonElement>
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

type ButtonAsLink = {
  children: ReactNode
  className?: string
  href: string
  prefetch?: boolean
}

type ButtonProps = ButtonAsButton | ButtonAsLink

export const Button = (props: ButtonProps) => {
  const { children, className } = props
  const classes = clsx(styles.button, className)

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
