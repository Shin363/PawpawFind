import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ReportLocationMap } from '@/features/report-location'
import { useSightingReportQuery } from '../hooks/useSightingReportsQuery'
import './SightingReportDetailPage.css'

export function SightingReportDetailPage() {
  const navigate = useNavigate()
  const { sightingId } = useParams<{ sightingId: string }>()
  const { data: report, isError, isPending, refetch } = useSightingReportQuery(sightingId)
  const [isRouteOpen, setIsRouteOpen] = useState(false)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)

  if (isPending)
    return (
      <main className="report-detail-page">
        <p role="status">목격 제보를 불러오는 중입니다.</p>
      </main>
    )
  if (isError || !report)
    return (
      <main className="report-detail-page">
        <div className="report-detail-page__feedback" role="alert">
          <h1>목격 제보를 찾을 수 없습니다.</h1>
          <button onClick={() => void refetch()} type="button">
            다시 시도
          </button>
        </div>
      </main>
    )

  const details = [
    ['동물 종류', report.speciesLabel],
    ['색상', report.colorText],
    ['크기', report.sizeLabel],
    ['발견 장소', report.areaText],
    ['발견 시간', `${report.dateText} ${report.timeBandText}`],
    ['털 길이', report.coatLengthLabel],
    ['착용 중', report.wearingText],
    ['행동', report.behaviorText],
  ]
  const selectedPhoto = report.photos[selectedPhotoIndex]
  const galleryItemCount = report.photos.length || 3
  const showPreviousPhoto = () =>
    setSelectedPhotoIndex((current) => (current - 1 + galleryItemCount) % galleryItemCount)
  const showNextPhoto = () => setSelectedPhotoIndex((current) => (current + 1) % galleryItemCount)

  return (
    <main className="report-detail-page">
      <button
        className="report-detail-page__back"
        onClick={() => navigate('/sightings')}
        type="button"
      >
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
          <path d="m14.5 5.5-6.5 6.5 6.5 6.5" />
        </svg>
        목록으로
      </button>
      <div className="report-detail-page__layout">
        <section aria-label="제보 사진" className="report-detail-page__gallery">
          <div className="report-detail-page__carousel">
            <div className="report-detail-page__main-photo">
              {selectedPhoto ? (
                <img alt={selectedPhoto.alt} src={selectedPhoto.url} />
              ) : (
                <span>제보 사진 {selectedPhotoIndex + 1}</span>
              )}
            </div>
            <button
              aria-label="이전 사진"
              className="report-detail-page__carousel-button report-detail-page__carousel-button--previous"
              disabled={galleryItemCount <= 1}
              onClick={showPreviousPhoto}
              type="button"
            >
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                <path d="m14.5 5.5-6.5 6.5 6.5 6.5" />
              </svg>
            </button>
            <button
              aria-label="다음 사진"
              className="report-detail-page__carousel-button report-detail-page__carousel-button--next"
              disabled={galleryItemCount <= 1}
              onClick={showNextPhoto}
              type="button"
            >
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
              </svg>
            </button>
            <span className="report-detail-page__carousel-counter">
              {selectedPhotoIndex + 1} / {galleryItemCount}
            </span>
          </div>
          <div className="report-detail-page__thumbnails">
            {[0, 1, 2].map((index) => {
              const photo = report.photos[index]
              const isSelected = selectedPhotoIndex === index

              return photo ? (
                <button
                  aria-label={`제보 사진 ${index + 1} 크게 보기`}
                  aria-pressed={isSelected}
                  className="report-detail-page__thumbnail"
                  key={photo.id}
                  onClick={() => setSelectedPhotoIndex(index)}
                  type="button"
                >
                  <img alt="" src={photo.url} />
                </button>
              ) : (
                <div
                  aria-hidden="true"
                  className={`report-detail-page__thumbnail${isSelected ? ' report-detail-page__thumbnail--selected' : ''}`}
                  key={`empty-photo-${index}`}
                />
              )
            })}
          </div>
        </section>
        <section className="report-detail-page__content">
          <header>
            <h1>{report.title}</h1>
            <span className="report-detail-page__badge">
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                <path d="M12 20.5s6.4-5.6 6.4-10.1a6.4 6.4 0 0 0-12.8 0c0 4.5 6.4 10.1 6.4 10.1Z" />
                <circle cx="12" cy="10.2" r="2.3" />
              </svg>
              목격 제보
            </span>
          </header>
          <dl className="report-detail-page__facts">
            {details.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <section aria-labelledby="location-title" className="report-detail-page__location">
            <h2 id="location-title">발견 위치</h2>
            <ReportLocationMap
              areaText={report.areaText}
              latitude={report.location.lat}
              longitude={report.location.lng}
              radiusM={report.location.radiusM}
            />
            {!isRouteOpen ? (
              <button
                className="report-detail-page__route-button"
                onClick={() => setIsRouteOpen(true)}
                type="button"
              >
                예측 경로 확인하기
              </button>
            ) : (
              <div className="report-detail-page__route">
                <div className="report-detail-page__route-heading">
                  <h3>예측 이동 경로</h3>
                  <button onClick={() => setIsRouteOpen(false)} type="button">
                    접기
                  </button>
                </div>
                <ol>
                  {report.predictedRoute.map((point) => (
                    <li
                      className={`report-detail-page__route-point report-detail-page__route-point--${point.kind}`}
                      key={point.id}
                    >
                      <strong>{point.areaText}</strong>
                      <span>{point.dateTimeText}</span>
                      <span>{point.description}</span>
                    </li>
                  ))}
                </ol>
                <p>여러 제보의 시간과 위치를 이어 추정한 경로예요. 실제 이동과 다를 수 있어요.</p>
              </div>
            )}
          </section>
          <p className="report-detail-page__privacy">제보자 정보는 공개되지 않아요.</p>
        </section>
      </div>
    </main>
  )
}
