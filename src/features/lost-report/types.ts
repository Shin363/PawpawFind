import type { TraitSelections } from '../../constants/traitCategories'

export type Species = 'DOG' | 'CAT'
export type AnimalSize = 'SMALL' | 'MEDIUM' | 'LARGE'
export type AnimalColor = 'WHITE' | 'CREAM' | 'BROWN' | 'GRAY' | 'BLACK'

export interface LostReportLocation {
  areaName: string
  lat: number
  lng: number
  detail: string
}

export interface CreateLostReportRequest {
  fileIds: string[] // 정면/측면/전신 중 채워진 것만, 순서대로
  species: Species
  size: AnimalSize
  colors: AnimalColor[]
  location: LostReportLocation
  lostDate: string
  lostHour?: number
  traits: TraitSelections
}

export interface LostReport {
  id: string
}
