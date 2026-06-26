import { useEffect, useState } from 'react'
import type { MediaItem, MediaListResponse } from '../types/tmdb'

export function useMediaList(
  fetcher: () => Promise<MediaListResponse>,
  deps: unknown[]
): { items: MediaItem[]; loading: boolean; error: string | null } {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetcher()
      .then((res) => {
        if (!cancelled) setItems(res.results ?? [])
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { items, loading, error }
}
