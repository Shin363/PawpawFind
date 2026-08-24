import { useEffect, useState, type MouseEvent } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'
import { login } from '@/api/auth.api'
import { LoginSheet } from '@/features/auth'
import { useAuth } from '@/hooks/useAuth'
import type { AuthRedirectState } from '../guards/RequireAuth'
import { routeUrls } from '../paths'
import './AppLayout.css'

export function AppLayout() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const redirectState = location.state as AuthRedirectState | null
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  useEffect(() => {
    if (redirectState?.authRequired) setIsLoginOpen(true)
  }, [redirectState?.authRequired])

  const handleFindClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isAuthenticated) return

    event.preventDefault()
    setIsLoginOpen(true)
  }

  return (
    <>
      <header className="app-header">
        <div className="app-header__inner">
          <NavLink className="app-header__brand" to={routeUrls.home()}>
            <span aria-hidden="true">🐾</span> PawPawFind
          </NavLink>
          <nav aria-label="주요 메뉴">
            <NavLink to={routeUrls.sightingReports()}>목격 제보</NavLink>
            <NavLink onClick={handleFindClick} to={routeUrls.missingAnimalSearch()}>
              실종 동물 찾기
            </NavLink>
          </nav>
          <NavLink aria-label="마이페이지" className="app-header__mypage" to={routeUrls.myPage()}>
            ♙
          </NavLink>
        </div>
      </header>
      <Outlet />
      {isLoginOpen && (
        <LoginSheet onDismiss={() => setIsLoginOpen(false)} onKakaoLogin={() => void login()} />
      )}
    </>
  )
}
