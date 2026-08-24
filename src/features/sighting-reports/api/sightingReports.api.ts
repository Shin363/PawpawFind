import { apiClient } from '@/api/client'
import type {
  ReportFeatureApiItem,
  ReportListApiItem,
  ReportListApiResponse,
  ReportPhotoApiItem,
  SightingReportDetail,
  SightingReportListItem,
  SightingReportListResponse,
} from '../types'

export const SIGHTING_REPORTS_API_PATH = '/api/reports'
export const REPORT_PHOTOS_API_PATH = '/api/report-photos'
export const REPORT_FEATURES_API_PATH = '/api/report-features'

const speciesLabels: Record<string, string> = { DOG: '강아지', CAT: '고양이' }
const sizeLabels: Record<string, string> = { SMALL: '소형', MEDIUM: '중형', LARGE: '대형' }

function getFeatureText(features: ReportFeatureApiItem[], category: string) {
  const keywords = features
    .filter((feature) => feature.category === category)
    .map((feature) => feature.keyword)

  return keywords.length > 0 ? keywords.join(', ') : '정보 없음'
}

function getTimeBandText(eventHour: number | null) {
  if (eventHour === null) return '시간 미상'

  const startHour = Math.max(0, eventHour - 1)
  const endHour = Math.min(24, eventHour + 1)
  return `${String(startHour).padStart(2, '0')}–${String(endHour).padStart(2, '0')}시`
}

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

export async function getReportPhotos(reportId: string, signal?: AbortSignal) {
  const { data } = await apiClient.get<ReportPhotoApiItem[]>(REPORT_PHOTOS_API_PATH, {
    params: { reportId },
    signal,
  })

  return [...data].sort((a, b) => a.sortOrder - b.sortOrder)
}

export async function getReportFeatures(reportId: string, signal?: AbortSignal) {
  const { data } = await apiClient.get<ReportFeatureApiItem[]>(REPORT_FEATURES_API_PATH, {
    params: { reportId },
    signal,
  })

  return data
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

export async function getSightingReport(
  sightingId: string,
  signal?: AbortSignal,
): Promise<SightingReportDetail> {
  const encodedSightingId = encodeURIComponent(sightingId)
  const [{ data: report }, photos, features] = await Promise.all([
    apiClient.get<ReportListApiItem>(`${SIGHTING_REPORTS_API_PATH}/${encodedSightingId}`, {
      signal,
    }),
    getReportPhotos(sightingId, signal),
    getReportFeatures(sightingId, signal),
  ])
  const listItem = toSightingReportListItem(report)

  return {
    ...listItem,
    colorText: getFeatureText(features, '털색'),
    timeBandText: getTimeBandText(report.eventHour),
    coatLengthLabel: getFeatureText(features, '털길이'),
    wearingText: getFeatureText(features, '착용 중'),
    behaviorText: getFeatureText(features, '행동'),
    photos: photos.map((photo, index) => ({
      id: String(photo.id),
      url: photo.photoUrl,
      alt: `${listItem.title} 제보 사진 ${index + 1}`,
    })),
    location: { lat: report.latitude, lng: report.longitude, radiusM: 300 },
    predictedRoute: [],
  } satisfies SightingReportDetail
}
