import type { ListResponse } from '@/types/domain'

export interface SightingReportListItem {
  id: string
  title: string
  speciesLabel: string
  areaText: string
  dateText: string
}

export type SightingReportListResponse = ListResponse<SightingReportListItem>
