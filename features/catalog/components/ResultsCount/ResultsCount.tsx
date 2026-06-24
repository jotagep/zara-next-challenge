import styles from './ResultsCount.module.css'

type ResultsCountProps = {
  count: number
  isSearching: boolean
  id?: string
}

export const ResultsCount = ({ count, isSearching, id }: ResultsCountProps) => (
  <p id={id} aria-live="polite" className={styles.text}>
    {isSearching ? 'Searching…' : `${count} ${count === 1 ? 'RESULT' : 'RESULTS'}`}
  </p>
)
