'use client'

import { useEffect, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { SEARCH_PARAM } from '@/shared/config/routes'
import { useDebounce } from '@/shared/hooks/useDebounce'

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

  const urlSearch = params.get(SEARCH_PARAM) ?? ''
  const [value, setValue] = useState(urlSearch)
  const debounced = useDebounce(value)

  useEffect(() => {
    if (debounced === urlSearch) return
    const nextParams = new URLSearchParams(params.toString())
    const trimmed = debounced.trim()
    if (trimmed) {
      nextParams.set(SEARCH_PARAM, trimmed)
    } else {
      nextParams.delete(SEARCH_PARAM)
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
