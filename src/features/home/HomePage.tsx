import type { MouseEvent } from 'react'
import { Link, useOutletContext } from 'react-router'
import './HomePage.css'

interface HomeOutletContext {
  handleFindClick: (event: MouseEvent<HTMLAnchorElement>) => void
}

export function HomePage() {
  const { handleFindClick } = useOutletContext<HomeOutletContext>()

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero__content">
          <h1>
            잃어버린 반려동물을 <em>AI 외형예측</em>과 <em>주변 제보</em>를 통해 다시 찾아보세요
          </h1>
          <p>전국 보호소 데이터와 AI 매칭을 통해 가장 유사한 후보를 빠르게 확인합니다.</p>
          <div className="home-hero__actions">
            <Link
              className="home-pill-button home-pill-button--primary"
              onClick={handleFindClick}
              to="/find/new"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="6.4" />
                <path d="m16 16 4 4" />
              </svg>
              사진으로 찾기
            </Link>
            <Link className="home-pill-button home-pill-button--secondary" to="/sightings/new">
              동물을 발견했어요
            </Link>
          </div>
        </div>
        <svg aria-hidden="true" className="home-hero__down" viewBox="0 0 24 24">
          <path d="m6 9.5 6 6 6-6" />
        </svg>
      </section>

      <section className="home-matching">
        <div className="home-matching__copy">
          <h2>전국 보호소 데이터와 AI 매칭</h2>
          <p>사진 한 장으로 전국의 보호소 데이터를 분석하여 유사한 후보군을 정리해 드립니다.</p>
          <ol>
            <li>
              <span>1</span>
              <div>
                <strong>사진 업로드</strong>
                <p>정면 사진을 올려주세요.</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>AI 특징 분석</strong>
                <p>품종과 패턴을 분석합니다.</p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>후보 확인</strong>
                <p>유사도 점수 순으로 보여드립니다.</p>
              </div>
            </li>
          </ol>
        </div>
        <div aria-label="AI 매칭 결과 예시" className="home-match-preview" role="img">
          <div className="home-match-preview__original">
            <span>원본</span>
          </div>
          <div>
            <span>92%</span>
          </div>
          <div>
            <span>85%</span>
          </div>
        </div>
      </section>

      <section className="home-reports">
        <div className="home-section-inner">
          <h2>우리 동네 실시간 제보</h2>
          <p className="home-reports__description">
            이웃들의 제보로 가장 최근 목격 위치를 확인하세요.
          </p>
          <div className="home-map-legend">
            <span>
              <i className="home-map-legend__sighting" />
              목격 제보
            </span>
            <span>
              <i className="home-map-legend__missing" />
              실종 위치
            </span>
          </div>
          <div className="home-map-frame">
            <div className="home-map">
              <svg aria-hidden="true" preserveAspectRatio="xMidYMid slice" viewBox="0 0 900 460">
                <rect fill="#f2f4f1" height="460" width="900" />
                <path
                  d="M0 300 C140 268 210 322 340 300 C470 278 560 330 700 306 C790 291 850 300 900 292 L900 360 C840 368 780 356 700 366 C560 384 470 340 340 358 C210 376 140 330 0 356 Z"
                  fill="#dce7ef"
                />
                <g fill="#e7eae4">
                  <rect height="120" rx="6" width="180" x="40" y="40" />
                  <rect height="120" rx="6" width="130" x="250" y="40" />
                  <rect height="80" rx="6" width="200" x="410" y="40" />
                  <rect height="120" rx="6" width="220" x="640" y="40" />
                  <rect height="90" rx="6" width="200" x="410" y="150" />
                  <rect height="70" rx="6" width="180" x="40" y="190" />
                  <rect height="70" rx="6" width="130" x="250" y="190" />
                  <rect height="70" rx="6" width="220" x="640" y="190" />
                  <rect height="52" rx="6" width="240" x="40" y="392" />
                  <rect height="40" rx="6" width="200" x="320" y="404" />
                  <rect height="52" rx="6" width="300" x="560" y="392" />
                </g>
                <g fill="none" stroke="#fff" strokeLinecap="round">
                  <path d="M0 176 H900" strokeWidth="14" />
                  <path d="M0 276 H900M0 380 H900" strokeWidth="9" />
                  <path d="M234 0 V460M625 0 V460" strokeWidth="12" />
                  <path d="M396 0 V460" strokeWidth="8" />
                  <path d="M790 0 V460" strokeWidth="7" />
                </g>
              </svg>
              <span className="home-map__radius" />
              <span className="home-map__missing-label">실종 위치</span>
              <span className="home-map__missing-dot" />
              <span className="home-map__paw-pin">
                <svg aria-hidden="true" viewBox="0 0 24 24">
                  <ellipse cx="8.4" cy="8.6" rx="2.3" ry="3" />
                  <ellipse cx="12" cy="6.9" rx="2.3" ry="3" />
                  <ellipse cx="15.6" cy="8.6" rx="2.3" ry="3" />
                  <path d="M12 12.4c3.1 0 5.6 2.2 5.6 4.9 0 1.9-1.6 3.1-3.5 3.1-.9 0-1.5-.3-2.1-.3s-1.2.3-2.1.3c-1.9 0-3.5-1.2-3.5-3.1 0-2.7 2.5-4.9 5.6-4.9Z" />
                </svg>
              </span>
              <div className="home-map__report">
                <span />
                <div>
                  <strong>비슷한 강아지 봤어요</strong>
                  <small>2시간 전 · 마포구 연남동</small>
                </div>
              </div>
              <span className="home-map__sighting-dot" />
            </div>
          </div>
          <Link className="home-pill-button home-pill-button--secondary" to="/sightings">
            목격 제보 지도 열기
          </Link>
        </div>
      </section>

      <section className="home-final-cta">
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M4 14.5h3.4l3 2.4h4.2M4 14.5V20h13.6l2.4-3.6M12.2 10.6 9.8 8.3a2.1 2.1 0 0 1 3-3l.4.4.4-.4a2.1 2.1 0 0 1 3 3l-2.4 2.3a1.4 1.4 0 0 1-2 0Z" />
        </svg>
        <h2>
          가장 빠른 만남,
          <br />
          지금 시작하세요
        </h2>
        <p>가진 사진이 단 한 장이라도 좋습니다.</p>
        <Link
          className="home-pill-button home-pill-button--primary"
          onClick={handleFindClick}
          to="/find/new"
        >
          사진 업로드하기 <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  )
}
