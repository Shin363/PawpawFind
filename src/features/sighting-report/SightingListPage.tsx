import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSightings } from './sightingReport.api'
import type { StoredSighting } from './sightingReport.api'
import { TRAIT_CATEGORIES } from '../../constants/traitCategories'
import type { AnimalColor, AnimalSize, Species } from './types'
import './SightingReportForm.css'

const PAGE_SIZE = 10

const NAV_BUTTON_STYLE: React.CSSProperties = {
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  font: 'inherit',
  padding: 0,
}

const SPECIES_OPTIONS: { value: Species; label: string }[] = [
  { value: 'DOG', label: '강아지' },
  { value: 'CAT', label: '고양이' },
]
const SIZE_OPTIONS: { value: AnimalSize; label: string }[] = [
  { value: 'SMALL', label: '소형' },
  { value: 'MEDIUM', label: '중형' },
  { value: 'LARGE', label: '대형' },
]
const COLOR_OPTIONS: { value: AnimalColor; label: string }[] = [
  { value: 'WHITE', label: '흰색' },
  { value: 'CREAM', label: '크림' },
  { value: 'BROWN', label: '갈색' },
  { value: 'GRAY', label: '회색' },
  { value: 'BLACK', label: '검정' },
]

const SIZE_LABEL: Record<string, string> = { SMALL: '소형', MEDIUM: '중형', LARGE: '대형' }
const SPECIES_LABEL: Record<string, string> = { DOG: '강아지', CAT: '고양이' }
const COLOR_LABEL: Record<string, string> = {
  WHITE: '흰색',
  CREAM: '크림',
  BROWN: '갈색',
  GRAY: '회색',
  BLACK: '검정',
}

const FILTER_SECTIONS = [
  { key: 'species', label: '동물 종류', options: SPECIES_OPTIONS },
  { key: 'size', label: '크기', options: SIZE_OPTIONS },
  { key: 'color', label: '색상', options: COLOR_OPTIONS },
  ...TRAIT_CATEGORIES.map((c) => ({
    key: c.key,
    label: c.label,
    options: c.options.map((o) => ({ value: o, label: o })),
  })),
]

type FilterState = Record<string, string[]>

function createEmptyFilterState(): FilterState {
  const state: FilterState = {}
  for (const section of FILTER_SECTIONS) {
    state[section.key] = []
  }
  return state
}

export function SightingListPage() {
  const navigate = useNavigate()
  const [sightings, setSightings] = useState<StoredSighting[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>('species')
  const [filters, setFilters] = useState<FilterState>(createEmptyFilterState())
  const [page, setPage] = useState(1)

  useEffect(() => {
    getSightings().then((list) => {
      setSightings(list)
      setIsLoading(false)
    })
  }, [])

  function toggleFilterOption(sectionKey: string, value: string) {
    setFilters((prev) => {
      const current = prev[sectionKey] || []
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return { ...prev, [sectionKey]: next }
    })
    setPage(1)
  }

  function activeCount(sectionKey: string) {
    return filters[sectionKey]?.length ?? 0
  }

  const filteredSightings = useMemo(() => {
    return sightings.filter((s) => {
      if (filters.species.length > 0 && !filters.species.includes(s.species)) return false
      if (filters.size.length > 0 && !filters.size.includes(s.size)) return false
      if (filters.color.length > 0 && !s.colors.some((c) => filters.color.includes(c))) return false

      for (const category of TRAIT_CATEGORIES) {
        const selected = filters[category.key]
        if (!selected || selected.length === 0) continue
        const value = s.traits[category.key]
        const itemValues = Array.isArray(value) ? value : value ? [value] : []
        const matches = itemValues.some((v) => selected.includes(v))
        if (!matches) return false
      }
      return true
    })
  }, [sightings, filters])

  const totalCount = filteredSightings.length
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const pageItems = filteredSightings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const rangeStart = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(page * PAGE_SIZE, totalCount)

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

      <div style={{ padding: '32px 40px', maxWidth: 900, margin: '0 auto' }}>
        <button type="button" className="back-link" onClick={() => navigate('/')}>
          ← 홈으로
        </button>
        <h1 className="report-title">목격 제보</h1>
        <p className="report-subtext">최근 들어온 제보를 시간순으로 보여드려요.</p>

        <button
          type="button"
          className="filter-toggle-btn"
          onClick={() => setShowFilterPanel((prev) => !prev)}
        >
          필터 {showFilterPanel ? '닫기' : ''}
        </button>

        {showFilterPanel && (
          <div className="filter-panel">
            {FILTER_SECTIONS.map((section) => {
              const isOpen = openSection === section.key
              const count = activeCount(section.key)
              return (
                <div key={section.key} className="filter-section">
                  <button
                    type="button"
                    className="filter-section-header"
                    onClick={() => setOpenSection(isOpen ? null : section.key)}
                  >
                    <span>
                      {section.label}
                      {count > 0 && <span className="count-badge">{count}개 선택</span>}
                    </span>
                    <span className={`chevron ${isOpen ? 'open' : ''}`}>▾</span>
                  </button>
                  {isOpen && (
                    <div className="filter-section-body">
                      {section.options.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={`filter-chip ${filters[section.key]?.includes(option.value) ? 'selected' : ''}`}
                          onClick={() => toggleFilterOption(section.key, option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div className="report-list-meta-row">
          <span className="report-list-count">
            전체 {totalCount}건 · {rangeStart}~{rangeEnd}
          </span>
        </div>

        {isLoading && <p className="helper-text">불러오는 중...</p>}

        {!isLoading && totalCount === 0 && (
          <div className="helper-box">조건에 맞는 제보가 없어요.</div>
        )}

        <div className="report-list-grid">
          {pageItems.map((s) => (
            <button
              key={s.id}
              type="button"
              className="report-list-card"
              onClick={() => navigate(`/sightings/${s.id}`)}
            >
              <div className="report-list-thumb">
                {s.photoFiles[0] && (
                  <img
                    src={URL.createObjectURL(s.photoFiles[0])}
                    alt={s.title || '목격 제보 사진'}
                  />
                )}
              </div>
              <div className="report-list-info">
                <div className="title">{s.title || '(제목 없음)'}</div>
                <div className="meta1">
                  {SPECIES_LABEL[s.species]}
                  {s.colors.length > 0 && ` · ${s.colors.map((c) => COLOR_LABEL[c]).join(',')}`}
                  {` · ${SIZE_LABEL[s.size]}`}
                </div>
                <div className="meta2">
                  {s.location.areaName} {s.sightedDate}
                </div>
              </div>
            </button>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination-bar">
            <button
              type="button"
              className="pagination-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                className={`pagination-btn ${p === page ? 'active' : ''}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              className="pagination-btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              →
            </button>
          </div>
        )}

        <p className="source-note">국가동물보호정보시스템 공공데이터 · 이용자 목격 제보 기준</p>
      </div>
    </div>
  )
}
