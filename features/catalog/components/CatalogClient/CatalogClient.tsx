'use client'

import { PhoneGrid } from '@/features/catalog/components/PhoneGrid/PhoneGrid'
import { SearchInput } from '@/features/catalog/components/SearchInput/SearchInput'
import { useSearchParamSync } from '@/features/catalog/hooks/useSearchParamSync'
import type { PhoneListItem } from '@/shared/lib/types/domain'

import styles from './CatalogClient.module.css'

type CatalogClientProps = {
  initialPhones: PhoneListItem[]
}

export const CatalogClient = ({ initialPhones }: CatalogClientProps) => {
  const { value, setValue, isPending, urlSearch } = useSearchParamSync()
  const isSearching = isPending || value !== urlSearch

  return (
    <div className={styles.content}>
      <SearchInput
        value={value}
        onChange={setValue}
        count={initialPhones.length}
        isSearching={isSearching}
      />
      <div
        className={isSearching ? styles.dimmed : undefined}
        aria-busy={isSearching}
        aria-live="polite"
      >
        <PhoneGrid phones={initialPhones} />
      </div>
    </div>
  )
}
