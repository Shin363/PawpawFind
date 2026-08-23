import { useNavigate } from 'react-router'
import { SightingReportFormPage } from '@/features/sighting-reports'
import { routeUrls } from '../paths'

export function SightingReportFormRoute() {
  const navigate = useNavigate()

  return (
    <SightingReportFormPage
      onSubmit={() => navigate(routeUrls.sightingReports(), { replace: true })}
    />
  )
}
