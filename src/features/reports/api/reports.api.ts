import { getJson } from '@/api/client'
import type { SightingReportListResponse } from '../types'

export const SIGHTING_REPORTS_API_PATH = '/api/sighting-reports'

export function getSightingReports(signal?: AbortSignal) {
  return getJson<SightingReportListResponse>(SIGHTING_REPORTS_API_PATH, signal)
}
