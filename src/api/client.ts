import { env } from '@/config/env'

export class ApiError extends Error {
  constructor(public readonly status: number) {
    super(`API request failed with status ${status}`)
    this.name = 'ApiError'
  }
}

const createApiUrl = (path: string) => {
  if (!env.apiBaseUrl) {
    return path
  }

  return new URL(path, env.apiBaseUrl).toString()
}

export async function getJson<T>(path: string, signal?: AbortSignal) {
  const response = await fetch(createApiUrl(path), {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw new ApiError(response.status)
  }

  return (await response.json()) as T
}
