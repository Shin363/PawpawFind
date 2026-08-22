import { useQuery } from '@tanstack/react-query'
import { getSightingReports } from '../api/sightingReports.api'

export const sightingReportKeys = {
  all: ['sighting-reports'] as const,
  list: () => [...sightingReportKeys.all, 'list'] as const,
}

export function useSightingReportsQuery() {
  return useQuery({
    queryKey: sightingReportKeys.list(),
    queryFn: ({ signal }) => getSightingReports(signal),
  })
}
