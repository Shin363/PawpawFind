import { Link } from 'react-router'
import { routeUrls } from '@/app/router/paths'
import './HomePage.css'

function SearchIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="6.4" />
      <path d="m16 16 4 4" />
    </svg>
  )
}

function PawMarkerIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <ellipse cx="8.4" cy="8.6" rx="2.3" ry="3" />
      <ellipse cx="12" cy="6.9" rx="2.3" ry="3" />
      <ellipse cx="15.6" cy="8.6" rx="2.3" ry="3" />
      <path d="M12 12.4c3.1 0 5.6 2.2 5.6 4.9 0 1.9-1.6 3.1-3.5 3.1-.9 0-1.5-.3-2.1-.3s-1.2.3-2.1.3c-1.9 0-3.5-1.2-3.5-3.1 0-2.7 2.5-4.9 5.6-4.9z" />
    </svg>
  )
}

const matchingSteps = [
  ['사진 업로드', '정면 사진을 올려주세요.'],
  ['AI 특징 분석', '품종과 패턴을 분석합니다.'],
  ['후보 확인', '유사도 점수 순으로 보여드립니다.'],
] as const

export function HomePage() {
  return (
    <main className="home-page">
      <section className="home-hero" aria-labelledby="home-hero-title">
        <div className="home-hero__content">
          <h1 id="home-hero-title">
            잃어버린 반려동물을 <em>AI 외형예측</em>과 <em>주변 제보</em>를 통해 다시 찾아보세요
          </h1>
          <p>전국 보호소 데이터와 AI 매칭을 통해 가장 유사한 후보를 빠르게 확인합니다.</p>
          <div className="home-actions">
            <Link className="home-action home-action--primary" to={routeUrls.missingAnimalSearch()}>
              <SearchIcon />
              사진으로 실종동물 찾기
            </Link>
            <Link
              className="home-action home-action--secondary"
              to={routeUrls.sightingReportForm()}
            >
              동물을 발견했어요
            </Link>
          </div>
        </div>
        <a className="home-hero__scroll" href="#ai-matching" aria-label="AI 매칭 소개로 이동">
          <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
            <path d="m6 9.5 6 6 6-6" />
          </svg>
        </a>
      </section>

      <section className="home-section home-matching" id="ai-matching">
        <div className="home-section__copy">
          <h2>전국 보호소 데이터와 AI 매칭</h2>
          <p>사진 한 장으로 전국의 보호소 데이터를 분석하여 유사한 후보군을 정리해 드립니다.</p>
          <ol className="matching-steps">
            {matchingSteps.map(([title, description], index) => (
              <li key={title}>
                <span className="matching-steps__number" aria-hidden="true">
                  {index + 1}
                </span>
                <span>
                  <strong>{title}</strong>
                  <small>{description}</small>
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="matching-preview" aria-label="AI 사진 매칭 결과 예시">
          <div className="matching-preview__image matching-preview__image--original">
            <span>원본</span>
          </div>
          <div className="matching-preview__image">
            <span>92%</span>
          </div>
          <div className="matching-preview__image">
            <span>85%</span>
          </div>
        </div>
      </section>

      <section className="home-sightings" aria-labelledby="nearby-sightings-title">
        <div className="home-section home-sightings__inner">
          <div className="home-section__copy">
            <h2 id="nearby-sightings-title">우리 동네 실시간 제보</h2>
            <p>이웃들의 제보로 가장 최근 목격 위치를 확인하세요.</p>
          </div>
          <div className="sighting-legend" aria-label="지도 범례">
            <span>
              <i className="sighting-legend__dot sighting-legend__dot--report" />
              목격 제보
            </span>
            <span>
              <i className="sighting-legend__dot sighting-legend__dot--missing" />
              실종 위치
            </span>
          </div>
          <div className="sighting-map-frame">
            <div
              className="sighting-map"
              role="img"
              aria-label="실종 위치와 주변 목격 제보를 나타낸 지도 예시"
            >
              <svg
                aria-hidden="true"
                className="sighting-map__drawing"
                preserveAspectRatio="xMidYMid slice"
                viewBox="0 0 900 460"
              >
                <rect width="900" height="460" fill="#f2f4f1" />
                <path
                  d="M0 300C140 268 210 322 340 300s220 30 360 6c90-15 150-6 200-14v68c-60 8-120-4-200 6-140 18-230-26-360-8-130 18-200-28-340-2Z"
                  fill="#dce7ef"
                />
                <g fill="#e7eae4">
                  <rect x="40" y="40" width="180" height="120" rx="6" />
                  <rect x="250" y="40" width="130" height="120" rx="6" />
                  <rect x="410" y="40" width="200" height="80" rx="6" />
                  <rect x="640" y="40" width="220" height="120" rx="6" />
                  <rect x="410" y="150" width="200" height="90" rx="6" />
                  <rect x="40" y="190" width="180" height="70" rx="6" />
                  <rect x="250" y="190" width="130" height="70" rx="6" />
                  <rect x="640" y="190" width="220" height="70" rx="6" />
                  <rect x="40" y="392" width="240" height="52" rx="6" />
                  <rect x="320" y="404" width="200" height="40" rx="6" />
                  <rect x="560" y="392" width="300" height="52" rx="6" />
                </g>
                <g fill="none" stroke="#fff" strokeLinecap="round">
                  <path d="M0 176h900" strokeWidth="14" />
                  <path d="M0 276h900M0 380h900" strokeWidth="9" />
                  <path d="M234 0v460M625 0v460" strokeWidth="12" />
                  <path d="M396 0v460" strokeWidth="8" />
                  <path d="M790 0v460" strokeWidth="7" />
                </g>
              </svg>
              <span className="sighting-map__radius" />
              <span className="sighting-map__missing-label">실종 위치</span>
              <span className="sighting-map__missing-dot" />
              <span className="sighting-map__marker">
                <PawMarkerIcon />
              </span>
              <span className="sighting-map__report-dot" />
              <div className="sighting-map__card">
                <span className="sighting-map__thumbnail" />
                <span>
                  <strong>비슷한 강아지 봤어요</strong>
                  <small>2시간 전 · 마포구 연남동</small>
                </span>
              </div>
            </div>
          </div>
          <Link
            className="home-action home-action--secondary home-sightings__link"
            to={routeUrls.sightingReports()}
          >
            목격 제보 목록 열기
          </Link>
        </div>
      </section>

      <section className="home-final-cta" aria-labelledby="home-final-title">
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
          <path d="M4 14.5h3.4l3 2.4h4.2M4 14.5V20h13.6l2.4-3.6M12.2 10.6 9.8 8.3a2.1 2.1 0 0 1 3-3l.4.4.4-.4a2.1 2.1 0 0 1 3 3l-2.4 2.3a1.4 1.4 0 0 1-2 0Z" />
        </svg>
        <h2 id="home-final-title">
          가장 빠른 만남,
          <br />
          지금 시작하세요
        </h2>
        <p>가진 사진이 단 한 장이라도 좋습니다.</p>
        <Link className="home-action home-action--primary" to={routeUrls.missingAnimalSearch()}>
          사진 업로드하기 <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  )
}
