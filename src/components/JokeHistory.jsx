export function JokeHistory({ history, onClear }) {
  if (history.length === 0) return null

  function handleClear() {
    if (window.confirm('Clear all joke history?')) {
      onClear()
    }
  }

  return (
    <section className="joke-history">
      <p className="joke-history__label">History</p>
      <ul className="joke-history__list">
        {history.map((joke) => (
          <li key={joke.id} className="joke-history__item">
            <span className="joke-history__preview">{joke.text}</span>
            <span className="joke-history__tag">{joke.category ?? 'Custom'}</span>
          </li>
        ))}
      </ul>
      <button className="joke-history__clear" onClick={handleClear}>
        Clear history
      </button>
    </section>
  )
}
