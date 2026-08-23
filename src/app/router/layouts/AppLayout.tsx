import { NavLink, Outlet } from 'react-router'
import { routeUrls } from '../paths'
import './AppLayout.css'

export function AppLayout() {
  return (
    <>
      <header className="app-header">
        <div className="app-header__inner">
          <NavLink className="app-header__brand" to={routeUrls.home()}>
            <span aria-hidden="true">🐾</span> PawPawFind
          </NavLink>
          <nav aria-label="주요 메뉴">
            <NavLink to={routeUrls.sightingReports()}>목격 제보</NavLink>
            <NavLink to={routeUrls.missingAnimalSearch()}>우리 아이 찾기</NavLink>
          </nav>
          <NavLink aria-label="마이페이지" className="app-header__mypage" to={routeUrls.myPage()}>
            ♙
          </NavLink>
        </div>
      </header>
      <Outlet />
    </>
  )
}
