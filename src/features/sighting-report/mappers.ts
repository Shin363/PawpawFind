import type { TraitSelections } from '../../constants/traitCategories'
import type { CreateSightingRequest } from './types'

// 백엔드 DB 스키마 기준 (추후 report_features 테이블 방식으로 다시 정리 예정)
export interface SightingBackendPayload {
  report_type: 'SIGHTING'
  title: string
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

export function toBackendPayload(request: CreateSightingRequest): SightingBackendPayload {
  return {
    report_type: 'SIGHTING',
    title: request.title,
    species: request.species,
    size: request.size,
    color: request.colors.join(','),
    feature_tags: flattenTraitSelections(request.traits).join(','),
    happen_date: request.sightedDate,
    happen_hour: request.sightedHour,
    happen_place: request.location.areaName,
    happen_place_detail: request.location.detail,
    latitude: request.location.lat,
    longitude: request.location.lng,
    fileIds: request.fileIds,
  }
}
//화면에서 쓰는 데이터(예: 색상 여러 개 ['흰색','갈색'])를 서버가 원하는 문자열 형태("흰색,갈색")로 바꿔주는 "번역기
