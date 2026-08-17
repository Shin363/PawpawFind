import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getSighting } from './sightingReport.api'
import type { StoredSighting } from './sightingReport.api'
import './SightingReportForm.css'

const NAV_BUTTON_STYLE: React.CSSProperties = {
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  font: 'inherit',
  padding: 0,
}

const SIZE_LABEL: Record<string, string> = { SMALL: '소형', MEDIUM: '중형', LARGE: '대형' }
const SPECIES_LABEL: Record<string, string> = { DOG: '강아지', CAT: '고양이' }
const COLOR_LABEL: Record<string, string> = {
  WHITE: '흰색',
  CREAM: '크림',
  BROWN: '갈색',
  GRAY: '회색',
  BLACK: '검정',
}

export function SightingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [sighting, setSighting] = useState<StoredSighting | null | undefined>(undefined)

  useEffect(() => {
    if (!id) return
    getSighting(id).then((result) => setSighting(result ?? null))
  }, [id])

  if (sighting === undefined) {
    return (
      <div className="report-page">
        <div style={{ padding: 40 }}>불러오는 중...</div>
      </div>
    )
  }

  if (sighting === null) {
    return (
      <div className="report-page">
        <div style={{ padding: 40 }}>
          <button type="button" className="back-link" onClick={() => navigate('/sightings')}>
            ← 목록으로
          </button>
          <h2>제보를 찾을 수 없어요</h2>
        </div>
      </div>
    )
  }

  const featureEntries = Object.entries(sighting.traits).filter(([, value]) =>
    Array.isArray(value) ? value.length > 0 : !!value,
  )

  return (
    <div className="report-page">
      <header className="report-header">
        <div className="brand">
          <span className="logo-dot">🐾</span> PawPawFind
        </div>
        <nav>
          <button
            type="button"
            style={NAV_BUTTON_STYLE}
            onClick={() => navigate('/report/sighting')}
          >
            목격 제보
          </button>
          <button type="button" style={NAV_BUTTON_STYLE} onClick={() => navigate('/report/lost')}>
            우리 아이 찾기
          </button>
        </nav>
      </header>

      <div style={{ padding: '32px 40px', maxWidth: 700, margin: '0 auto' }}>
        <button type="button" className="back-link" onClick={() => navigate('/sightings')}>
          ← 목록으로
        </button>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto' }}>
          {sighting.photoFiles.map((file, index) => (
            <img
              key={index}
              src={URL.createObjectURL(file)}
              alt={`사진 ${index + 1}`}
              style={{
                width: 160,
                height: 160,
                objectFit: 'cover',
                borderRadius: 14,
                flexShrink: 0,
              }}
            />
          ))}
        </div>

        <h1 className="report-title">{sighting.title || '(제목 없음)'}</h1>

        <div className="field-section">
          <div className="field-label">기본 정보</div>
          <p className="helper-text" style={{ margin: 0 }}>
            {SPECIES_LABEL[sighting.species]} · {SIZE_LABEL[sighting.size]}
            {sighting.colors.length > 0 &&
              ` · ${sighting.colors.map((c) => COLOR_LABEL[c]).join(', ')}`}
          </p>
        </div>

        <div className="field-section">
          <div className="field-label">발견 장소</div>
          <p className="helper-text" style={{ margin: 0 }}>
            {sighting.location.areaName}
            {sighting.location.detail && ` · ${sighting.location.detail}`}
          </p>
        </div>

        <div className="field-section">
          <div className="field-label">발견 날짜 · 시간</div>
          <p className="helper-text" style={{ margin: 0 }}>
            {sighting.sightedDate}
            {sighting.sightedHour !== undefined ? ` · ${sighting.sightedHour}시경` : ' · 시간 모름'}
          </p>
        </div>

        {featureEntries.length > 0 && (
          <div className="field-section">
            <div className="field-label">외형 특징</div>
            <div className="chip-row">
              {featureEntries.map(([category, value]) => {
                const values = Array.isArray(value) ? value : [value]
                return values.map((v) => (
                  <span key={`${category}-${v}`} className="trait-chip" aria-pressed="true">
                    {v}
                  </span>
                ))
              })}
            </div>
          </div>
        )}

        <div className="notice-box">
          <div className="notice-title">제보자 정보는 공개되지 않아요</div>
          <div className="notice-sub">
            등록된 {new Date(sighting.createdAt).toLocaleString('ko-KR')}
          </div>
        </div>
      </div>
    </div>
  )
}
