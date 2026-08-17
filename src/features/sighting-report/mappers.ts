import type { TraitSelections } from '../../constants/traitCategories'
import type { CreateSightingRequest } from './types'

// 백엔드 Reports.java / ReportFeatures.java 기준 (8/15 실제 백엔드 코드 확인)
export interface ReportPayload {
  reportType: 'FOUND'
  title?: string
  species: string
  size: string
  color: string
  eventDate: string
  eventHour?: number
  happenPlace: string
  latitude: number
  longitude: number
  description: string
}

export interface ReportFeaturePayload {
  category: string
  keyword: string
}

function toFeaturePayloads(traits: TraitSelections): ReportFeaturePayload[] {
  const rows: ReportFeaturePayload[] = []
  for (const [category, value] of Object.entries(traits)) {
    if (Array.isArray(value)) {
      for (const keyword of value) {
        rows.push({ category, keyword })
      }
    } else if (value) {
      rows.push({ category, keyword: value })
    }
  }
  return rows
}

function toIsoDate(dotDate: string): string {
  return dotDate.replace(/\./g, '-')
}

export function toReportPayload(request: CreateSightingRequest): ReportPayload {
  return {
    reportType: 'FOUND',
    title: request.title,
    species: request.species,
    size: request.size,
    color: request.colors.join(','),
    eventDate: toIsoDate(request.sightedDate),
    eventHour: request.sightedHour,
    happenPlace: request.location.areaName,
    latitude: request.location.lat,
    longitude: request.location.lng,
    description: request.location.detail || '상세 설명 없음',
  }
}

export function toFeaturePayloadsFromRequest(
  request: CreateSightingRequest,
): ReportFeaturePayload[] {
  return toFeaturePayloads(request.traits)
}
