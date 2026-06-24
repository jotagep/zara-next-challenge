import { CatalogClient } from '@/features/catalog/components/CatalogClient/CatalogClient'
import { PAGE_SIZE } from '@/features/catalog/constants'
import { fetchPhones } from '@/shared/lib/api'

import styles from './page.module.css'

type PageProps = {
  searchParams: Promise<{ search?: string }>
}

export default async function HomePage({ searchParams }: PageProps) {
  const { search } = await searchParams
  const phones = await fetchPhones({ search, limit: PAGE_SIZE })

  const initialPhones = Array.from(new Set(phones.map((phone) => phone.id))).map(
    (id) => phones.find((phone) => phone.id === id)!
  )

  return (
    <main className={styles.page}>
      <section className={styles.toolbar}>
        <CatalogClient initialPhones={initialPhones} />
      </section>
    </main>
  )
}
