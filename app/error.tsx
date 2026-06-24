'use client'

import { useEffect } from 'react'

import { Button } from '@/shared/components/Button/Button'

import styles from './error.module.css'

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error)
    }
  }, [error])

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h1 className={styles.title}>Something went wrong</h1>
        <p className={styles.message}>We couldn&apos;t load the catalog. Please try again.</p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </main>
  )
}
