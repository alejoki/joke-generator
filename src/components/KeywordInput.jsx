export function KeywordInput({ value, onChange, onGenerate, loading, error }) {
  return (
    <div className="keyword-input">
      <div className="keyword-input__row">
        <input
          type="text"
          className="keyword-input__field"
          placeholder="optional keywords: santa, reindeer…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && onGenerate()}
          disabled={loading}
        />
        <button
          className="keyword-input__button"
          onClick={onGenerate}
          disabled={loading}
        >
          {loading ? 'Generating…' : 'Generate'}
        </button>
      </div>
      {error && <p className="keyword-input__error">{error}</p>}
    </div>
  )
}
