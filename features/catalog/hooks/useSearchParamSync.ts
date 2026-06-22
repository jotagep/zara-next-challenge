'use client'

import { useEffect, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { useDebounce } from '@/hooks/useDebounce'

type UseSearchParamSyncResult = {
  value: string
  setValue: (value: string) => void
  isPending: boolean
  urlSearch: string
}

export const useSearchParamSync = (): UseSearchParamSyncResult => {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const urlSearch = params.get('search') ?? ''
  const [value, setValue] = useState(urlSearch)
  const debounced = useDebounce(value)

  useEffect(() => {
    if (debounced === urlSearch) return
    const nextParams = new URLSearchParams(params.toString())
    const trimmed = debounced.trim()
    if (trimmed) {
      nextParams.set('search', trimmed)
    } else {
      nextParams.delete('search')
    }
    const nextQuery = nextParams.toString()
    if (nextQuery === params.toString()) return
    const target = nextQuery ? `${pathname}?${nextQuery}` : pathname
    startTransition(() => {
      router.replace(target, { scroll: false })
    })
  }, [debounced, urlSearch, params, pathname, router, startTransition])

  return { value, setValue, isPending, urlSearch }
}
