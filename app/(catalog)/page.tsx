import { CatalogClient } from '@/features/catalog/components/CatalogClient/CatalogClient'
import { FETCH_INITIAL_COUNT } from '@/features/catalog/constants'
import { fetchPhones } from '@/shared/lib/api'
import { uniqBy } from '@/shared/lib/utils/uniqBy'

type PageProps = {
  searchParams: Promise<{ s?: string }>
}

export default async function HomePage({ searchParams }: PageProps) {
  const { s: search } = await searchParams
  const phones = await fetchPhones({ search, limit: FETCH_INITIAL_COUNT })

  const uniquePhones = uniqBy(phones, (phone) => phone.id)

  return <CatalogClient initialPhones={uniquePhones} />
}
