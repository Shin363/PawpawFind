import { apiClient } from '@/api/client'
import type {
  ReportListApiItem,
  ReportListApiResponse,
  SightingReportDetail,
  SightingReportListItem,
  SightingReportListResponse,
} from '../types'

export const SIGHTING_REPORTS_API_PATH = '/api/reports'

const speciesLabels: Record<string, string> = { DOG: '강아지', CAT: '고양이' }
const sizeLabels: Record<string, string> = { SMALL: '소형', MEDIUM: '중형', LARGE: '대형' }

export function toSightingReportListItem(report: ReportListApiItem): SightingReportListItem {
  return {
    id: String(report.reportId),
    title: report.title,
    speciesLabel: speciesLabels[report.species] ?? report.species,
    colorText: '',
    sizeLabel: sizeLabels[report.size] ?? report.size,
    areaText: report.happenPlace,
    dateText: report.eventDate.replace(/-/g, '.'),
  }
}

export async function getSightingReports(page: number, size: number, signal?: AbortSignal) {
  const { data } = await apiClient.get<ReportListApiResponse>(SIGHTING_REPORTS_API_PATH, {
    params: { page, size, reportType: 'FOUND' },
    signal,
  })

  return {
    items: data.content.map(toSightingReportListItem),
    page: {
      number: data.number,
      size: data.size,
      totalCount: data.totalElements,
      totalPages: data.totalPages,
    },
  } satisfies SightingReportListResponse
}

export async function getSightingReport(sightingId: string, signal?: AbortSignal) {
  const { data } = await apiClient.get<SightingReportDetail>(
    `${SIGHTING_REPORTS_API_PATH}/${encodeURIComponent(sightingId)}`,
    { signal },
  )

  return data
}
