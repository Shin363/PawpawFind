import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { server } from '@/mocks/server'
import { sightingReportsFixture } from '@/mocks/fixtures/reports'
import { renderWithQueryClient } from '@/test/render'
import * as reportsApi from './api/reports.api'
import { ReportListPage } from './ReportListPage'

const { SIGHTING_REPORTS_API_PATH } = reportsApi

describe('ReportListPage', () => {
  it('요청 중에는 로딩 상태를 보여준다', () => {
    renderWithQueryClient(<ReportListPage />)

    expect(screen.getByRole('status')).toHaveTextContent('목격 제보를 불러오는 중입니다.')
  })

  it('목격 제보 목록을 보여준다', async () => {
    renderWithQueryClient(<ReportListPage />)

    expect(
      await screen.findByRole('heading', {
        name: '갈색 소형견을 목격했어요',
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '치즈색 고양이를 찾습니다' })).toBeInTheDocument()
  })

  it('목격 제보가 없으면 빈 목록 안내를 보여준다', async () => {
    server.use(
      http.get(`*${SIGHTING_REPORTS_API_PATH}`, () =>
        HttpResponse.json({
          items: [],
          page: { number: 0, size: 20, totalCount: 0 },
        }),
      ),
    )

    renderWithQueryClient(<ReportListPage />)

    expect(await screen.findByText('등록된 목격 제보가 없습니다.')).toBeInTheDocument()
  })

  it('API 요청이 실패하면 오류를 보여주고 다시 시도할 수 있다', async () => {
    let requestCount = 0

    server.use(
      http.get(`*${SIGHTING_REPORTS_API_PATH}`, () => {
        requestCount += 1

        return requestCount === 1
          ? new HttpResponse(null, { status: 500 })
          : HttpResponse.json(sightingReportsFixture)
      }),
    )

    const user = userEvent.setup()
    renderWithQueryClient(<ReportListPage />)

    expect(await screen.findByRole('alert')).toHaveTextContent('목격 제보를 불러오지 못했습니다.')

    await user.click(screen.getByRole('button', { name: '다시 시도' }))

    expect(
      await screen.findByRole('heading', {
        name: '갈색 소형견을 목격했어요',
      }),
    ).toBeInTheDocument()
  })
})
