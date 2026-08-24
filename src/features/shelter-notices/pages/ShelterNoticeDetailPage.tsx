import { useNavigate, useParams } from 'react-router'
import sampleDogImage from '@/assets/sighting-report-mocks/sample-dog.png'
import { ReportLocationMap } from '@/features/report-location'
import './ShelterNoticeDetailPage.css'

const SHELTER_NOTICES = {
  'notice-1': {
    title: '말티즈 · 흰색 · 수컷 보호 중',
    noticeNumber: '서울-강서-2026-00842',
    species: '강아지',
    color: '흰색',
    size: '소형',
    sex: '수컷',
    foundPlace: '서울 강서구',
    foundDate: '2026.08.08',
    noticePeriod: '2026.08.08 – 2026.08.18',
    shelterName: '강서구동물보호센터',
    imageUrl: sampleDogImage,
    latitude: 37.5509,
    longitude: 126.8495,
  },
  'notice-2': {
    title: '믹스견 · 흰색 · 암컷 보호 중',
    noticeNumber: '서울-강서-2026-00867',
    species: '강아지',
    color: '흰색',
    size: '중형',
    sex: '암컷',
    foundPlace: '서울 강서구',
    foundDate: '2026.08.07',
    noticePeriod: '2026.08.07 – 2026.08.17',
    shelterName: '강서구동물보호센터',
    imageUrl: sampleDogImage,
    latitude: 37.5509,
    longitude: 126.8495,
  },
} as const

export function ShelterNoticeDetailPage() {
  const navigate = useNavigate()
  const { noticeId = '' } = useParams<{ noticeId: string }>()
  const notice = SHELTER_NOTICES[noticeId as keyof typeof SHELTER_NOTICES]

  if (!notice) {
    return (
      <main className="shelter-notice-detail-page">
        <div className="shelter-notice-detail-page__missing" role="alert">
          <h1>보호소 공고를 찾을 수 없습니다.</h1>
          <button onClick={() => navigate(-1)} type="button">
            뒤로 가기
          </button>
        </div>
      </main>
    )
  }

  const details = [
    ['공고번호', notice.noticeNumber],
    ['동물 종류', notice.species],
    ['색상', notice.color],
    ['크기', notice.size],
    ['성별', notice.sex],
    ['발견 장소', notice.foundPlace],
    ['발견 시간', notice.foundDate],
    ['공고 기간', notice.noticePeriod],
    ['보호 장소', notice.shelterName],
  ]

  return (
    <main className="shelter-notice-detail-page">
      <button
        className="shelter-notice-detail-page__back"
        onClick={() => navigate(-1)}
        type="button"
      >
        <span aria-hidden="true">‹</span> 뒤로 가기
      </button>
      <div className="shelter-notice-detail-page__layout">
        <section aria-label="보호 동물 사진" className="shelter-notice-detail-page__gallery">
          <div className="shelter-notice-detail-page__main-photo">
            <img alt={`${notice.title} 사진`} src={notice.imageUrl} />
          </div>
          <div className="shelter-notice-detail-page__thumbnails">
            <button aria-label="보호 동물 사진 1 크게 보기" aria-pressed="true" type="button">
              <img alt="" src={notice.imageUrl} />
            </button>
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </div>
        </section>

        <section className="shelter-notice-detail-page__content">
          <header>
            <h1>{notice.title}</h1>
            <span className="shelter-notice-detail-page__badge">⌂ 보호소 공고</span>
          </header>
          <dl>
            {details.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <section
            aria-labelledby="shelter-location-title"
            className="shelter-notice-detail-page__location"
          >
            <h2 id="shelter-location-title">보호소 위치</h2>
            <ReportLocationMap
              areaText={notice.shelterName}
              latitude={notice.latitude}
              longitude={notice.longitude}
              radiusM={0}
            />
            <p>보호소 주소는 전체 공개돼요.</p>
          </section>
          <p className="shelter-notice-detail-page__source">
            공고 정보는 국가동물보호정보시스템 데이터를 따릅니다.
          </p>
        </section>
      </div>
    </main>
  )
}
