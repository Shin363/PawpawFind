import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  it('미인증 사용자가 우리 아이 찾기를 누르면 카카오 로그인 창을 보여준다', async () => {
    const user = userEvent.setup()
    const router = renderRoute('/')

    await user.click(screen.getByRole('link', { name: '우리 아이 찾기' }))

    expect(router.state.location.pathname).toBe('/')
    expect(
      screen.getByRole('heading', { name: '우리 아이 찾기는 로그인이 필요해요' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '카카오로 계속하기' })).toHaveFocus()
    expect(screen.queryByRole('button', { name: /Google/ })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '나중에 하기' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
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

  it('목격 제보 상세 route parameter로 데이터를 불러온다', async () => {
    const user = userEvent.setup()
    renderRoute('/sightings/1')
    expect(
      await screen.findByRole('heading', { name: '연남동 골목에서 갈색 중형견 봤어요' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '다음 사진' }))
    expect(screen.getByText('2 / 2')).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: '주황색과 흰색 무늬가 있는 고양이 예시 사진' }),
    ).toBeInTheDocument()
  })

  it('미인증 사용자를 보호 경로에서 홈으로 이동시키고 목적지를 보존한다', async () => {
    const router = renderRoute('/find/results/search-1')

    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
    expect(router.state.location.state).toEqual({
      authRequired: true,
      returnTo: '/find/results/search-1',
    })
    expect(screen.getByRole('dialog')).toHaveTextContent('카카오로 계속하기')
  })

  it('등록되지 않은 경로에 404 화면을 렌더링한다', () => {
    renderRoute('/unknown')
    expect(screen.getByRole('heading', { name: '페이지를 찾을 수 없습니다.' })).toBeInTheDocument()
  })
})
