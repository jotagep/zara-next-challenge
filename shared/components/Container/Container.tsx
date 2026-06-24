import clsx from 'clsx'

import styles from './Container.module.css'

export const CONTAINER_SIZES = ['narrow', 'default', 'wide'] as const

export type ContainerSize = (typeof CONTAINER_SIZES)[number]

type ContainerProps = {
  children: React.ReactNode
  className?: string
  size?: ContainerSize
}

export const Container = ({ children, className, size = 'default' }: ContainerProps) => (
  <div className={clsx(styles.container, styles[`size-${size}`], className)}>{children}</div>
)
