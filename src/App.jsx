import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { CategoryPills } from './components/CategoryPills'
import { KeywordInput } from './components/KeywordInput'
import { JokeCard } from './components/JokeCard'
import { JokeHistory } from './components/JokeHistory'
import { generateJoke } from './utils/api'
import { loadHistory, saveHistory, clearHistory } from './utils/storage'
import './App.css'

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [keywords, setKeywords] = useState('')
  const [currentJoke, setCurrentJoke] = useState(null)
  const [history, setHistory] = useState(() => loadHistory())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    saveHistory(history)
  }, [history])

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    try {
      const text = await generateJoke(selectedCategory, keywords)
      const joke = {
        id: crypto.randomUUID(),
        text,
        category: selectedCategory,
        timestamp: Date.now(),
      }
      setCurrentJoke(joke)
      setHistory((prev) => [joke, ...prev])
    } catch (err) {
      if (err.message === 'rate_limit') {
        setError('Too many requests, slow down a bit.')
      } else {
        setError('Something went wrong, try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    clearHistory()
    setHistory([])
    setCurrentJoke(null)
  }

  return (
    <div className="app">
      <Header />
      <CategoryPills selected={selectedCategory} onSelect={setSelectedCategory} />
      <KeywordInput
        value={keywords}
        onChange={setKeywords}
        onGenerate={handleGenerate}
        loading={loading}
        error={error}
      />
      <JokeCard joke={currentJoke} />
      <JokeHistory history={history} onClear={handleClear} />
    </div>
  )
}
