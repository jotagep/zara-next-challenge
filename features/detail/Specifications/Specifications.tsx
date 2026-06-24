import type { PhoneSpecs } from '@/shared/lib/types/domain'
import clsx from 'clsx'

import styles from './Specifications.module.css'

type SpecificationsProps = {
  specs: PhoneSpecs
}

type SpecEntry = {
  label: string
  value: string
}

const buildEntries = (specs: PhoneSpecs): SpecEntry[] => [
  { label: 'Brand', value: specs.brand },
  { label: 'Name', value: specs.name },
  { label: 'Description', value: specs.description },
  { label: 'Screen', value: specs.screen },
  { label: 'Resolution', value: specs.resolution },
  { label: 'Processor', value: specs.processor },
  { label: 'Main camera', value: specs.mainCamera },
  { label: 'Selfie camera', value: specs.selfieCamera },
  { label: 'Battery', value: specs.battery },
  { label: 'OS', value: specs.os },
  { label: 'Screen refresh rate', value: specs.screenRefreshRate },
]

export const Specifications = ({ specs }: SpecificationsProps) => {
  const entries = buildEntries(specs)
  return (
    <section className={styles.section} aria-label="Specifications">
      <h2 className={styles.heading}>Specifications</h2>
      <dl className={styles.list}>
        {entries.map((entry, index) => (
          <div key={entry.label} className={clsx(styles.row, index === 0 && styles.firstRow)}>
            <dt className={styles.label}>{entry.label}</dt>
            <dd className={styles.value}>{entry.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
