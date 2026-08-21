import { delay, http, HttpResponse } from 'msw'
import { SIGHTING_REPORTS_API_PATH } from '@/features/reports/api/reports.api'
import { sightingReportsFixture } from '@/mocks/fixtures/reports'

export const reportsHandlers = [
  http.get(`*${SIGHTING_REPORTS_API_PATH}`, async () => {
    await delay(100)

    return HttpResponse.json(sightingReportsFixture)
  }),
]
