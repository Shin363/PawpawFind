import type { TraitSelections } from '../../constants/traitCategories'
import type { CreateLostReportRequest } from './types'

// 백엔드 DB 스키마 기준 (추후 report_features 테이블 방식으로 다시 정리 예정)
// 지금은 화면(types.ts) 최신 필드에 맞춰 에러 없이 돌아가게만 맞춘 버전
export interface LostReportBackendPayload {
  report_type: 'LOST'
  species: string
  size: string
  color: string
  feature_tags: string
  happen_date: string
  happen_hour?: number
  happen_place: string
  happen_place_detail: string
  latitude: number
  longitude: number
  fileIds: string[]
}

function flattenTraitSelections(traits: TraitSelections): string[] {
  const flatValues: string[] = []
  for (const value of Object.values(traits)) {
    if (Array.isArray(value)) {
      flatValues.push(...value)
    } else if (value) {
      flatValues.push(value)
    }
  }
  return flatValues
}

export function toBackendPayload(request: CreateLostReportRequest): LostReportBackendPayload {
  return {
    report_type: 'LOST',
    species: request.species,
    size: request.size,
    color: request.colors.join(','),
    feature_tags: flattenTraitSelections(request.traits).join(','),
    happen_date: request.lostDate,
    happen_hour: request.lostHour,
    happen_place: request.location.areaName,
    happen_place_detail: request.location.detail,
    latitude: request.location.lat,
    longitude: request.location.lng,
    fileIds: request.fileIds,
  }
}
