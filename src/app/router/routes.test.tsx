import { screen, waitFor } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { renderWithQueryClient } from '@/test/render'
import { appRoutes } from './routes'

function renderRoute(initialEntry: string) {
  const router = createMemoryRouter(appRoutes, { initialEntries: [initialEntry] })
  renderWithQueryClient(<RouterProvider router={router} />)
  return router
}

describe('appRoutes', () => {
  it('홈 경로를 렌더링한다', () => {
    renderRoute('/')
    expect(screen.getByRole('heading', { name: 'PawpawFind' })).toBeInTheDocument()
  })

  it('목격 제보 목록을 공개 경로로 렌더링한다', () => {
    renderRoute('/sightings')
    expect(screen.getByRole('heading', { name: '목격 제보 목록' })).toBeInTheDocument()
  })

  it('목격 제보 입력 폼을 공개 경로로 렌더링한다', () => {
    renderRoute('/sightings/new')
    expect(
      screen.getByRole('heading', { name: '목격한 동물의 사진을 올려주세요' }),
    ).toBeInTheDocument()
  })

  it('목격 제보 상세 route parameter를 전달한다', () => {
    renderRoute('/sightings/report-1')
    expect(screen.getByRole('heading', { name: '목격 제보 상세' })).toBeInTheDocument()
    expect(screen.getByText('제보 ID: report-1')).toBeInTheDocument()
  })

  it('미인증 사용자를 보호 경로에서 홈으로 이동시키고 목적지를 보존한다', async () => {
    const router = renderRoute('/find/results/search-1')

    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
    expect(router.state.location.state).toEqual({
      authRequired: true,
      returnTo: '/find/results/search-1',
    })
  })

  it('등록되지 않은 경로에 404 화면을 렌더링한다', () => {
    renderRoute('/unknown')
    expect(screen.getByRole('heading', { name: '페이지를 찾을 수 없습니다.' })).toBeInTheDocument()
  })
})
