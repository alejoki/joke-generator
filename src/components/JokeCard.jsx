export function JokeCard({ joke }) {
  if (!joke) return null

  return (
    <div className="joke-card">
      <p className="joke-card__text">{joke.text}</p>
      <span className="joke-card__tag">{joke.category ?? 'Custom'}</span>
    </div>
  )
}
