import { delay, http, HttpResponse } from 'msw'
import { SIGHTING_REPORTS_API_PATH } from '@/features/sighting-reports/api/sightingReports.api'
import {
  createSightingReportsPage,
  sightingReportDetailsFixture,
} from '@/mocks/fixtures/sightingReports'

export const sightingReportsHandlers = [
  http.get(`*${SIGHTING_REPORTS_API_PATH}/:sightingId`, async ({ params }) => {
    await delay(100)
    const report = sightingReportDetailsFixture[String(params.sightingId)]
    return report
      ? HttpResponse.json(report)
      : HttpResponse.json({ message: '목격 제보를 찾을 수 없습니다.' }, { status: 404 })
  }),
  http.get(`*${SIGHTING_REPORTS_API_PATH}`, async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const page = Math.max(0, Number(url.searchParams.get('page') ?? 0))
    const size = Math.max(1, Number(url.searchParams.get('size') ?? 20))
    const reportType = url.searchParams.get('reportType')

    if (reportType && reportType !== 'FOUND')
      return HttpResponse.json(createSightingReportsPage(0, size))
    return HttpResponse.json(createSightingReportsPage(page, size))
  }),
]
