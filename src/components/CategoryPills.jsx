const CATEGORIES = ['Dad Jokes', 'Puns', 'Dark Humor', 'Knock-knock', 'Surreal']

export function CategoryPills({ selected, onSelect }) {
  return (
    <div className="category-pills">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          className={`pill ${selected === cat ? 'pill--active' : ''}`}
          onClick={() => onSelect(selected === cat ? null : cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
