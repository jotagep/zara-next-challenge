import Link from 'next/link'

import { Container } from '@/shared/components/Container/Container'
import { ROUTES } from '@/shared/config/routes'

import styles from './BackLink.module.css'

export const BackLink = () => (
  <div className={styles.bar}>
    <Container>
      <Link href={ROUTES.home} className={styles.link}>
        <svg
          className={styles.chevron}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12.5 4.5L7 10L12.5 15.5"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <span className={styles.text}>Back</span>
      </Link>
    </Container>
  </div>
)
