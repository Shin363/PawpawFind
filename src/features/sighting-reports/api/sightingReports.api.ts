import { apiClient } from '@/api/client'
import type { SightingReportListResponse } from '../types'

export const SIGHTING_REPORTS_API_PATH = '/api/sighting-reports'

export async function getSightingReports(signal?: AbortSignal) {
  const { data } = await apiClient.get<SightingReportListResponse>(SIGHTING_REPORTS_API_PATH, {
    signal,
  })

  return data
}
