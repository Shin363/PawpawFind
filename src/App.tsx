import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { LostReportPage } from './features/lost-report'
import { SightingReportForm } from './features/sighting-report'

// 홈 화면은 담당 범위 밖 -> 실제 홈이 생기기 전까지 쓰는 임시 화면
// TODO: 실제 홈 화면 완성되면 이 부분은 교체
function HomePlaceholder() {
  return (
    <section>
      <h1>PawPawFind</h1>
      <p>(홈 화면은 별도 담당 파트 — 임시 화면)</p>
      <Link to="/report/lost">
        <button type="button">실종 동물 등록</button>
      </Link>
      <Link to="/report/sighting">
        <button type="button">발견 동물 제보</button>
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
      </Routes>
    </BrowserRouter>
  )
}

export default App
