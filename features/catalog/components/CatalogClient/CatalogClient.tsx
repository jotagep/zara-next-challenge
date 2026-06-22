'use client'

import { PhoneGrid } from '@/features/catalog/components/PhoneGrid/PhoneGrid'
import { PhoneGridSkeleton } from '@/features/catalog/components/PhoneGrid/PhoneGridSkeleton'
import { SearchInput } from '@/features/catalog/components/SearchInput/SearchInput'
import { useSearchParamSync } from '@/features/catalog/hooks/useSearchParamSync'
import type { PhoneListItem } from '@/lib/types/domain'

import styles from './CatalogClient.module.css'

type CatalogClientProps = {
  initialPhones: PhoneListItem[]
}

export const CatalogClient = ({ initialPhones }: CatalogClientProps) => {
  const { value, setValue, isPending, urlSearch } = useSearchParamSync()
  const isSearching = isPending || value !== urlSearch

  return (
    <>
      <SearchInput
        value={value}
        onChange={setValue}
        count={initialPhones.length}
        isSearching={isSearching}
      />
      {isSearching ? (
        <div className={styles.searching} aria-busy="true" aria-live="polite">
          <PhoneGridSkeleton />
        </div>
      ) : (
        <PhoneGrid phones={initialPhones} />
      )}
    </>
  )
}
