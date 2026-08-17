import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TraitToggle } from '../../components/TraitToggle'
import { LocationInput } from '../../components/LocationInput'
import { TRAIT_CATEGORIES, createEmptyTraitSelections } from '../../constants/traitCategories'
import type { TraitSelections } from '../../constants/traitCategories'
import { createSighting, uploadPhoto } from './sightingReport.api'
import type { AnimalColor, AnimalSize, CreateSightingRequest, Species } from './types'
import './SightingReportForm.css'

const MAX_PHOTOS = 3

interface UploadedPhoto {
  file: File
  fileId: string
}

const COLOR_META: { value: AnimalColor; label: string; hex: string }[] = [
  { value: 'WHITE', label: '흰색', hex: '#ffffff' },
  { value: 'CREAM', label: '크림', hex: '#f3e2c0' },
  { value: 'BROWN', label: '갈색', hex: '#8a5a34' },
  { value: 'GRAY', label: '회색', hex: '#9aa0a6' },
  { value: 'BLACK', label: '검정', hex: '#111111' },
]

const NAV_BUTTON_STYLE: React.CSSProperties = {
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  font: 'inherit',
  padding: 0,
}

function todayString() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}.${m}.${d}`
}

export function SightingReportForm() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const [species, setSpecies] = useState<Species>('DOG')
  const [size, setSize] = useState<AnimalSize>('MEDIUM')
  const [colors, setColors] = useState<AnimalColor[]>([])

  const [areaName, setAreaName] = useState('')
  const [locationLat, setLocationLat] = useState(37.5665)
  const [locationLng, setLocationLng] = useState(126.978)
  const [locationDetail, setLocationDetail] = useState('')

  const [sightedDate, setSightedDate] = useState(todayString())
  const [sightedHour, setSightedHour] = useState<number | undefined>(undefined)

  const [traits, setTraits] = useState<TraitSelections>(createEmptyTraitSelections())

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [submittedId, setSubmittedId] = useState<string | null>(null)

  function toggleColor(color: AnimalColor) {
    setColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]))
  }

  async function handlePhotoSelect(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    const remainingSlots = MAX_PHOTOS - photos.length
    const filesToAdd = Array.from(fileList).slice(0, remainingSlots)

    setIsUploading(true)
    setErrorMessage(null)
    try {
      for (const file of filesToAdd) {
        const { fileId } = await uploadPhoto(file)
        setPhotos((prev) => [...prev, { file, fileId }])
      }
    } catch {
      setErrorMessage('사진 업로드에 실패했어요. 다시 시도해주세요.')
    } finally {
      setIsUploading(false)
    }
  }

  function handleLocationChange(location: {
    areaName: string
    lat: number
    lng: number
    detail: string
  }) {
    setAreaName(location.areaName)
    setLocationLat(location.lat)
    setLocationLng(location.lng)
    setLocationDetail(location.detail)
  }

  async function handleSubmit() {
    setErrorMessage(null)
    if (photos.length === 0) {
      setErrorMessage('사진을 1장 이상 등록해주세요.')
      return
    }

    setIsSubmitting(true)
    try {
      const request: CreateSightingRequest = {
        title,
        fileIds: photos.map((p) => p.fileId),
        species,
        size,
        colors,
        location: {
          areaName: areaName || '위치 미설정',
          lat: locationLat,
          lng: locationLng,
          detail: locationDetail,
        },
        sightedDate,
        sightedHour,
        traits,
      }
      const result = await createSighting(
        request,
        photos.map((p) => p.file),
      )
      setSubmittedId(result.id)
    } catch (error) {
      const message = error instanceof Error ? error.message : '제보 등록에 실패했어요.'
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submittedId) {
    return (
      <div className="report-page">
        <header className="report-header">
          <div className="brand">
            <span className="logo-dot">🐾</span> PawPawFind
          </div>
        </header>
        <div style={{ padding: 40 }}>
          <h2>제보가 등록되었어요</h2>
          <p>등록 ID: {submittedId}</p>
          <button type="button" className="submit-button" onClick={() => navigate('/sightings')}>
            목격 제보 모음 보러가기
          </button>
          <button
            type="button"
            className="location-secondary-btn"
            style={{ borderTop: 'none', marginTop: 8 }}
            onClick={() => navigate('/')}
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="report-page">
      <header className="report-header">
        <div className="brand">
          <span className="logo-dot">🐾</span> PawPawFind
        </div>
        <nav>
          <button
            type="button"
            className="active"
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

      <div className="report-body">
        <div>
          <button type="button" className="back-link" onClick={() => navigate('/')}>
            ← 목격 제보 지도
          </button>
          <h1 className="report-title">
            목격한 아이의 사진을
            <br />
            올려주세요
          </h1>
          <p className="report-subtext">
            사진 한 장과 발견한 장소만 있어도 등록돼요. 등록된 실종 정보와 계속 비교돼요.
          </p>

          <div className="field-section">
            <div className="field-label">제목</div>
            <input
              className="text-input"
              type="text"
              placeholder="예: 연남동 골목에서 갈색 중형견 봤어요"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <p className="helper-text">
              목록에서 가장 먼저 보이는 문장이에요. 발견 장소와 생김새를 짧게 적어주세요.
            </p>
          </div>

          <div className="field-section">
            <div className="photo-grid">
              {[0, 1, 2].map((index) => {
                const photo = photos[index]
                return (
                  <label key={index} className={`photo-add-box ${photo ? 'filled' : ''}`}>
                    {photo ? (
                      <img
                        src={URL.createObjectURL(photo.file)}
                        alt={`사진 ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: 14,
                        }}
                      />
                    ) : (
                      <>
                        <span className="plus">+</span>
                        <span>사진 {index + 1}</span>
                      </>
                    )}
                    {!photo && (
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        disabled={photos.length >= MAX_PHOTOS || isUploading}
                        onChange={(event) => handlePhotoSelect(event.target.files)}
                      />
                    )}
                  </label>
                )
              })}
            </div>
            <div className="helper-box">
              멀리서 찍힌 사진도 괜찮아요. 몸 전체가 보이면 비교에 도움이 돼요.
            </div>
          </div>

          <div className="field-section">
            <div className="field-label">동물 종류</div>
            <div className="segment-group">
              <button
                type="button"
                className={species === 'DOG' ? 'selected' : ''}
                onClick={() => setSpecies('DOG')}
              >
                강아지
              </button>
              <button
                type="button"
                className={species === 'CAT' ? 'selected' : ''}
                onClick={() => setSpecies('CAT')}
              >
                고양이
              </button>
            </div>
          </div>

          <div className="field-section">
            <div className="field-label">크기</div>
            <div className="segment-group">
              {(['SMALL', 'MEDIUM', 'LARGE'] as AnimalSize[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={size === s ? 'selected' : ''}
                  onClick={() => setSize(s)}
                >
                  {s === 'SMALL' ? '소형' : s === 'MEDIUM' ? '중형' : '대형'}
                </button>
              ))}
            </div>
            <p className="helper-text">
              소형 5kg 이하 · 중형 5~15kg · 대형 15kg 이상 정도로 봐주세요.
            </p>
          </div>

          <div className="field-section">
            <div className="field-label">
              색상 <span className="field-hint">· 기억나는 것만</span>
            </div>
            <div className="chip-row">
              {COLOR_META.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  className={`color-chip ${colors.includes(c.value) ? 'selected' : ''}`}
                  onClick={() => toggleColor(c.value)}
                >
                  <span className="color-dot" style={{ background: c.hex }} />
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="field-section">
            <div className="field-label">발견 장소</div>
            <div className="location-card">
              <LocationInput onLocationChange={handleLocationChange} />
            </div>
          </div>

          <div className="field-section">
            <div className="field-label">발견 날짜 · 시간</div>
            <div className="datetime-row">
              <input
                className="text-input"
                type="date"
                value={sightedDate.replace(/\./g, '-')}
                onChange={(event) => setSightedDate(event.target.value.replace(/-/g, '.'))}
              />
              <select
                className="text-input"
                value={sightedHour ?? ''}
                onChange={(event) =>
                  setSightedHour(event.target.value === '' ? undefined : Number(event.target.value))
                }
              >
                <option value="">시간 모름</option>
                {Array.from({ length: 24 }, (_, hour) => (
                  <option key={hour} value={hour}>
                    {hour}시경
                  </option>
                ))}
              </select>
            </div>
            <p className="helper-text">시간을 모르면 비워두세요.</p>
          </div>

          <div className="field-section">
            <div className="field-label">동물 특징</div>
            <p className="helper-text" style={{ marginTop: 0, marginBottom: 10 }}>
              기억나는 부위만 골라주세요. 모두 채우지 않아도 돼요.
            </p>
            <div className="trait-display-box">아래에서 특징을 골라주세요</div>

            {TRAIT_CATEGORIES.map((category) => (
              <div key={category.key} className="trait-category">
                <div className="trait-category-title">
                  {category.label}
                  <span className="field-hint">
                    {category.selectionType === 'single' ? '하나만' : '여러 개 선택 가능'}
                  </span>
                </div>
                <TraitToggle
                  categories={[category]}
                  selections={traits}
                  onChange={(key, value) => setTraits((prev) => ({ ...prev, [key]: value }))}
                />
              </div>
            ))}
          </div>

          <div className="notice-box">
            <div className="notice-title">제보자 정보는 공개되지 않아요</div>
            <div className="notice-sub">보호자에게는 사진과 발견 장소·시간만 전달돼요.</div>
          </div>

          {errorMessage && <p className="error-text">{errorMessage}</p>}
          <button
            type="button"
            className="submit-button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? '등록 중...' : '제보 등록하기'}
          </button>
        </div>
      </div>

      <div className="bottom-bar">사진 1장부터 시작할 수 있어요</div>
    </div>
  )
}
