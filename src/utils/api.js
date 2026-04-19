const BASE_URL = 'http://localhost:8000'

export async function generateJoke(category, keywords) {
  const response = await fetch(`${BASE_URL}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, keywords }),
  })

  if (response.status === 429) {
    throw new Error('rate_limit')
  }
  if (!response.ok) {
    throw new Error('api_error')
  }

  const data = await response.json()
  if (!data.joke) throw new Error('api_error')
  return data.joke
}
