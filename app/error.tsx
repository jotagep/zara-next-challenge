'use client'

import { useEffect } from 'react'

import { Button } from '@/shared/components/Button/Button'

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
    <div className="messageScreenCenter">
      <div className="messageScreenCard">
        <h1 className="messageScreenTitle">Something went wrong</h1>
        <p className="messageScreenMessage">An unexpected error occurred. Please try again.</p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}
