import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { LostReportPage } from './features/lost-report'
import {
  SightingReportForm,
  SightingListPage,
  SightingDetailPage,
} from './features/sighting-report'
import { MockLoginPage } from './features/auth/MockLoginPage'

function HomePlaceholder() {
  return (
    <section style={{ padding: 40 }}>
      <h1>PawPawFind</h1>
      <p>(홈 화면은 별도 담당 파트 — 임시 화면)</p>
      <Link to="/report/lost">
        <button type="button">실종 동물 등록</button>
      </Link>
      <Link to="/report/sighting">
        <button type="button">발견 동물 제보</button>
      </Link>
      <Link to="/sightings">
        <button type="button">목격 제보 모음 보기</button>
      </Link>
    </section>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePlaceholder />} />
        <Route path="/report/lost" element={<LostReportPage />} />
        <Route path="/report/sighting" element={<SightingReportForm />} />
        <Route path="/sightings" element={<SightingListPage />} />
        <Route path="/sightings/:id" element={<SightingDetailPage />} />
        <Route path="/mock-login" element={<MockLoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
