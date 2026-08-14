import { useState } from 'react'
import { TraitToggle } from '../../components/TraitToggle'
import { LocationInput } from '../../components/LocationInput'
import { TRAIT_CATEGORIES, createEmptyTraitSelections } from '../../constants/traitCategories'
import type { TraitSelections } from '../../constants/traitCategories'
import { createSighting, uploadPhoto } from './sightingReport.api'
import type { AnimalColor, AnimalSize, CreateSightingRequest, Species } from './types'

const MAX_PHOTOS = 3

interface UploadedPhoto {
  file: File
  fileId: string
}

function todayString() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}.${m}.${d}`
}

export function SightingReportForm() {
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

  function removePhoto(fileId: string) {
    setPhotos((prev) => prev.filter((p) => p.fileId !== fileId))
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

      const result = await createSighting(request)
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
      <section>
        <h2>제보가 등록되었어요</h2>
        <p>등록 ID: {submittedId}</p>
      </section>
    )
  }

  return (
    <section>
      <h2>목격한 아이의 사진을 올려주세요</h2>
      <p>사진 한 장과 발견한 장소만 있어도 등록돼요. 등록된 실종 정보와 계속 비교돼요.</p>

      <label htmlFor="title">제목</label>
      <input
        id="title"
        type="text"
        placeholder="예: 연남동 골목에서 갈색 중형견 봤어요"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <p>목록에서 가장 먼저 보이는 문장이에요. 발견 장소와 생김새를 짧게 적어주세요.</p>

      <div>
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            type="button"
            disabled={index >= MAX_PHOTOS || isUploading}
            onClick={() => document.getElementById('photoInput')?.click()}
          >
            + 사진 {index + 1}
          </button>
        ))}
      </div>
      <input
        id="photoInput"
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        disabled={photos.length >= MAX_PHOTOS || isUploading}
        onChange={(event) => handlePhotoSelect(event.target.files)}
      />
      {isUploading && <p>업로드 중...</p>}
      <ul>
        {photos.map((photo) => (
          <li key={photo.fileId}>
            {photo.file.name}
            <button type="button" onClick={() => removePhoto(photo.fileId)}>
              삭제
            </button>
          </li>
        ))}
      </ul>
      <p>멀리서 찍힌 사진도 괜찮아요. 몸 전체가 보이면 비교에 도움이 돼요.</p>

      <fieldset>
        <legend>동물 종류</legend>
        <label>
          <input
            type="radio"
            name="species"
            checked={species === 'DOG'}
            onChange={() => setSpecies('DOG')}
          />
          강아지
        </label>
        <label>
          <input
            type="radio"
            name="species"
            checked={species === 'CAT'}
            onChange={() => setSpecies('CAT')}
          />
          고양이
        </label>
      </fieldset>

      <fieldset>
        <legend>크기</legend>
        {(['SMALL', 'MEDIUM', 'LARGE'] as AnimalSize[]).map((s) => (
          <label key={s}>
            <input type="radio" name="size" checked={size === s} onChange={() => setSize(s)} />
            {s === 'SMALL' ? '소형' : s === 'MEDIUM' ? '중형' : '대형'}
          </label>
        ))}
      </fieldset>
      <p>소형 5kg 이하 · 중형 5~15kg · 대형 15kg 이상 정도로 봐주세요.</p>

      <fieldset>
        <legend>색상 · 기억나는 것만</legend>
        {(['WHITE', 'CREAM', 'BROWN', 'GRAY', 'BLACK'] as AnimalColor[]).map((color) => (
          <label key={color}>
            <input
              type="checkbox"
              checked={colors.includes(color)}
              onChange={() => toggleColor(color)}
            />
            {color}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>발견 장소</legend>
        <LocationInput onLocationChange={handleLocationChange} />
      </fieldset>

      <fieldset>
        <legend>발견 날짜 · 시간</legend>
        <input
          type="date"
          value={sightedDate.replace(/\./g, '-')}
          onChange={(event) => setSightedDate(event.target.value.replace(/-/g, '.'))}
        />
        <select
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
        <p>시간을 모르면 비워두세요.</p>
      </fieldset>

      <fieldset>
        <legend>동물 특징</legend>
        <p>기억나는 부위만 골라주세요. 모두 채우지 않아도 돼요.</p>
        <TraitToggle
          categories={TRAIT_CATEGORIES}
          selections={traits}
          onChange={(key, value) => setTraits((prev) => ({ ...prev, [key]: value }))}
        />
      </fieldset>

      {errorMessage && <p role="alert">{errorMessage}</p>}

      <p>사진 1장부터 시작할 수 있어요</p>
      <button type="button" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? '등록 중...' : '제보 등록하기'}
      </button>
    </section>
  )
}
