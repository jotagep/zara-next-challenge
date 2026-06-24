import Link from 'next/link'

import { Bag } from '@/shared/components/Bag/Bag'
import { Logo } from '@/shared/components/Logo/Logo'
import { ROUTES } from '@/shared/config/routes'

import styles from './Header.module.css'

export const Header = () => (
  <header className={styles.header}>
    <nav aria-label="Primary" className={styles.inner}>
      <Link href={ROUTES.home} className={styles.logoLink} aria-label="Home">
        <Logo />
      </Link>
      <Bag className={styles.bag} />
    </nav>
  </header>
)
