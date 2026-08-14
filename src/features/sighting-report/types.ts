import type { TraitSelections } from '../../constants/traitCategories'

export type Species = 'DOG' | 'CAT'
export type AnimalSize = 'SMALL' | 'MEDIUM' | 'LARGE'
export type AnimalColor = 'WHITE' | 'CREAM' | 'BROWN' | 'GRAY' | 'BLACK'

export type LocationInputMethod = 'CURRENT_LOCATION' | 'DONG_SEARCH'

export interface SightingLocation {
  areaName: string
  lat: number
  lng: number
  detail: string
}

export interface CreateSightingRequest {
  title: string
  fileIds: string[]
  species: Species
  size: AnimalSize
  colors: AnimalColor[]
  location: SightingLocation
  sightedDate: string
  sightedHour?: number
  traits: TraitSelections
}

export interface Sighting {
  id: string
}
