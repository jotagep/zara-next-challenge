import styles from './ResultsCount.module.css'

type ResultsCountProps = {
  count: number
  isSearching: boolean
}

export const ResultsCount = ({ count, isSearching }: ResultsCountProps) => (
  <p className={styles.text}>
    {isSearching ? 'Searching…' : `${count} ${count === 1 ? 'RESULT' : 'RESULTS'}`}
  </p>
)
