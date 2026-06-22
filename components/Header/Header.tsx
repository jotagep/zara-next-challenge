import Link from 'next/link'

import { Bag } from '@/components/Bag/Bag'
import { Logo } from '@/components/Logo/Logo'

import styles from './Header.module.css'

export const Header = () => (
  <header className={styles.header}>
    <div className={styles.inner}>
      <Link href="/" className={styles.logoLink} aria-label="Home">
        <Logo />
      </Link>
      <Bag className={styles.bag} />
    </div>
  </header>
)
