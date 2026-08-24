import { useEffect, useState, type MouseEvent } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'
import { login } from '@/api/auth.api'
import pawpawfindLogo from '@/assets/pawpawfind-logo.png'
import { LoginSheet } from '@/features/auth'
import { useAuth } from '@/hooks/useAuth'
import type { AuthRedirectState } from '../guards/RequireAuth'
import { routeUrls } from '../paths'
import './AppLayout.css'

function PawLogo() {
  return <img alt="" aria-hidden="true" className="app-brand-mark" src={pawpawfindLogo} />
}

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
            <PawLogo />
            <span>PawPawFind</span>
          </NavLink>
          <nav aria-label="주요 메뉴">
            <NavLink to={routeUrls.sightingReports()}>목격 제보</NavLink>
            <NavLink onClick={handleFindClick} to={routeUrls.missingAnimalSearch()}>
              실종 동물 찾기
            </NavLink>
          </nav>
          <NavLink aria-label="마이페이지" className="app-header__mypage" to={routeUrls.myPage()}>
            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M5.75 19c.55-3.35 3-5.35 6.25-5.35s5.7 2 6.25 5.35"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.6"
              />
            </svg>
          </NavLink>
        </div>
      </header>
      <Outlet />
      <footer className="app-footer">
        <div className="app-footer__inner">
          <div className="app-footer__about">
            <NavLink className="app-footer__brand" to={routeUrls.home()}>
              <PawLogo />
              <span>PawPawFind</span>
            </NavLink>
            <p>잃어버린 반려동물을 보호소 공고와 이웃의 목격 제보로 함께 찾습니다.</p>
          </div>
          <nav className="app-footer__column" aria-label="하단 서비스 메뉴">
            <strong>서비스</strong>
            <NavLink to={routeUrls.sightingReports()}>목격 제보 목록</NavLink>
            <NavLink to={routeUrls.sightingReportForm()}>목격 제보 등록</NavLink>
            <NavLink to={routeUrls.missingAnimalSearch()}>사진으로 동물 찾기</NavLink>
          </nav>
          <div className="app-footer__column">
            <strong>데이터</strong>
            <span>국가동물보호정보시스템 공공데이터</span>
            <small>보호소 공고는 매일 갱신되며, 목격 제보는 이용자가 등록합니다.</small>
          </div>
          <div className="app-footer__column">
            <strong>문의</strong>
            <a href="mailto:help@pawpawfind.kr">help@pawpawfind.kr</a>
            <small>버전 0.1.0</small>
          </div>
        </div>
        <div className="app-footer__legal">
          <div>
            <span>© 2026 PawPawFind</span>
            <span>개인정보처리방침</span>
            <span>이용약관</span>
          </div>
        </div>
      </footer>
      {isLoginOpen && (
        <LoginSheet onDismiss={() => setIsLoginOpen(false)} onKakaoLogin={() => void login()} />
      )}
    </>
  )
}
