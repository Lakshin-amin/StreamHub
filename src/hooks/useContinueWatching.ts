import { useCallback, useEffect, useState } from 'react'
import type { ContinueWatchingEntry } from '../types/tmdb'

const STORAGE_KEY = 'lumen:continue-watching'
const MAX_ENTRIES = 12

function read(): ContinueWatchingEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ContinueWatchingEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function write(entries: ContinueWatchingEntry[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // storage unavailable (private mode, quota) — fail silently
  }
}

export function useContinueWatching() {
  const [entries, setEntries] = useState<ContinueWatchingEntry[]>([])

  useEffect(() => {
    setEntries(read())
  }, [])

  const upsert = useCallback((entry: Omit<ContinueWatchingEntry, 'updated_at'>) => {
    setEntries((prev) => {
      const next = [
        { ...entry, updated_at: Date.now() },
        ...prev.filter((e) => !(e.id === entry.id && e.media_type === entry.media_type)),
      ]
        .sort((a, b) => b.updated_at - a.updated_at)
        .slice(0, MAX_ENTRIES)
      write(next)
      return next
    })
  }, [])

  const remove = useCallback((id: number, mediaType: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => !(e.id === id && e.media_type === mediaType))
      write(next)
      return next
    })
  }, [])

  const clear = useCallback(() => {
    setEntries([])
    write([])
  }, [])

  return { entries, upsert, remove, clear }
}
