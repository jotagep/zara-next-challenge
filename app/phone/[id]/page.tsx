import { notFound } from 'next/navigation'

import { BackLink } from '@/features/detail/BackLink/BackLink'
import { ProductHero } from '@/features/detail/ProductHero/ProductHero'
import { SimilarProducts } from '@/features/detail/SimilarProducts/SimilarProducts'
import { Specifications } from '@/features/detail/Specifications/Specifications'
import { Container } from '@/shared/components/Container/Container'
import { fetchPhoneById } from '@/shared/lib/api'
import type { PhoneId } from '@/shared/lib/types/domain'

import styles from './page.module.css'

type PageProps = {
  params: Promise<{ id: string }>
}

export const generateMetadata = async ({ params }: PageProps) => {
  const { id } = await params
  try {
    const phone = await fetchPhoneById(id)
    return {
      title: `${phone.name} - ${phone.brand}`,
      description: phone.description,
    }
  } catch {
    return { title: 'Phone not found' }
  }
}

export default async function PhoneDetailPage({ params }: PageProps) {
  const { id } = await params

  let phone
  try {
    phone = await fetchPhoneById(id as PhoneId)
  } catch {
    notFound()
  }

  return (
    <>
      <BackLink />
      <Container size="narrow" className={styles.content}>
        <ProductHero phone={phone} />
        <Specifications specs={phone.specs} />
        <SimilarProducts products={phone.similarProducts} />
      </Container>
    </>
  )
}
