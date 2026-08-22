import { delay, http, HttpResponse } from 'msw'
import { SIGHTING_REPORTS_API_PATH } from '@/features/sighting-reports/api/sightingReports.api'
import { sightingReportsFixture } from '@/mocks/fixtures/sightingReports'

export const sightingReportsHandlers = [
  http.get(`*${SIGHTING_REPORTS_API_PATH}`, async () => {
    await delay(100)

    return HttpResponse.json(sightingReportsFixture)
  }),
]
