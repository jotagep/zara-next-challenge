import { CatalogClient } from '@/features/catalog/components/CatalogClient/CatalogClient'
import { FETCH_INITIAL_COUNT } from '@/features/catalog/constants'
import { fetchPhones } from '@/shared/lib/api'

type PageProps = {
  searchParams: Promise<{ s?: string }>
}

export default async function HomePage({ searchParams }: PageProps) {
  const { s: search } = await searchParams
  const phones = await fetchPhones({ search, limit: FETCH_INITIAL_COUNT })

  const initialPhones = Array.from(new Set(phones.map((phone) => phone.id))).map(
    (id) => phones.find((phone) => phone.id === id)!
  )

  return <CatalogClient initialPhones={initialPhones} />
}
