// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { loadHistory, saveHistory, clearHistory } from './storage'

const STORAGE_KEY = 'joke-history'

beforeEach(() => {
  localStorage.clear()
})

describe('loadHistory', () => {
  it('returns empty array when nothing stored', () => {
    expect(loadHistory()).toEqual([])
  })

  it('returns parsed array when data exists', () => {
    const jokes = [{ id: '1', text: 'hi', category: 'Puns', timestamp: 0 }]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jokes))
    expect(loadHistory()).toEqual(jokes)
  })
})

describe('saveHistory', () => {
  it('writes array to localStorage as JSON', () => {
    const jokes = [{ id: '2', text: 'yo', category: 'Surreal', timestamp: 1 }]
    saveHistory(jokes)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual(jokes)
  })
})

describe('clearHistory', () => {
  it('removes the key from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, '[]')
    clearHistory()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
