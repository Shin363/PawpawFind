import { useState } from 'react'
import { TraitToggle } from '../../components/TraitToggle'
import { LocationInput } from '../../components/LocationInput'
import { TRAIT_CATEGORIES, createEmptyTraitSelections } from '../../constants/traitCategories'
import type { TraitSelections } from '../../constants/traitCategories'
import { createLostReport, inferBreedFromPhoto, uploadPhoto } from './lostReport.api'
import type { AnimalColor, AnimalSize, CreateLostReportRequest, Species } from './types'

type SlotKey = 'front' | 'side' | 'full'

interface SlotPhoto {
  file: File
  fileId: string
  guessedBreed?: string
}

const SLOT_LABELS: { key: SlotKey; label: string }[] = [
  { key: 'front', label: '정면' },
  { key: 'side', label: '측면' },
  { key: 'full', label: '전신' },
]

function todayString() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}.${m}.${d}`
}

export function LostReportForm() {
  const [photos, setPhotos] = useState<Record<SlotKey, SlotPhoto | null>>({
    front: null,
    side: null,
    full: null,
  })
  const [uploadingSlot, setUploadingSlot] = useState<SlotKey | null>(null)

  const [species, setSpecies] = useState<Species>('DOG')
  const [size, setSize] = useState<AnimalSize>('MEDIUM')
  const [colors, setColors] = useState<AnimalColor[]>([])

  const [areaName, setAreaName] = useState('')
  const [locationLat, setLocationLat] = useState(37.5665)
  const [locationLng, setLocationLng] = useState(126.978)
  const [locationDetail, setLocationDetail] = useState('')

  const [lostDate, setLostDate] = useState(todayString())
  const [lostHour, setLostHour] = useState<number | undefined>(undefined)

  const [traits, setTraits] = useState<TraitSelections>(createEmptyTraitSelections())

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [submittedId, setSubmittedId] = useState<string | null>(null)

  function toggleColor(color: AnimalColor) {
    setColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]))
  }

  async function handleSlotSelect(slot: SlotKey, fileList: FileList | null) {
    const file = fileList?.[0]
    if (!file) return

    setUploadingSlot(slot)
    setErrorMessage(null)
    try {
      const { fileId } = await uploadPhoto(file)
      const { guessedBreed } = await inferBreedFromPhoto(fileId)
      setPhotos((prev) => ({ ...prev, [slot]: { file, fileId, guessedBreed } }))
    } catch {
      setErrorMessage('사진 업로드에 실패했어요. 다시 시도해주세요.')
    } finally {
      setUploadingSlot(null)
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

    const fileIds = SLOT_LABELS.map(({ key }) => photos[key]?.fileId).filter(
      (id): id is string => !!id,
    )

    if (fileIds.length === 0) {
      setErrorMessage('사진을 1장 이상 등록해주세요.')
      return
    }

    setIsSubmitting(true)
    try {
      const request: CreateLostReportRequest = {
        fileIds,
        species,
        size,
        colors,
        location: {
          areaName: areaName || '위치 미설정',
          lat: locationLat,
          lng: locationLng,
          detail: locationDetail,
        },
        lostDate,
        lostHour,
        traits,
      }

      const result = await createLostReport(request)
      setSubmittedId(result.id)
    } catch (error) {
      const message = error instanceof Error ? error.message : '등록에 실패했어요.'
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submittedId) {
    return (
      <section>
        <h2>실종 등록이 완료됐어요</h2>
        <p>등록 ID: {submittedId}</p>
      </section>
    )
  }

  return (
    <section>
      <h2>우리 아이 사진을 올려보세요</h2>
      <p>
        사진을 등록하면 전국 보호소와 목격 제보에서 비슷한 동물을 찾아드려요. 여러 각도의 사진이
        있으면 더 정확하게 비교할 수 있어요.
      </p>

      <div>
        {SLOT_LABELS.map(({ key, label }) => (
          <div key={key}>
            <button
              type="button"
              disabled={uploadingSlot === key}
              onClick={() => document.getElementById(`photoInput-${key}`)?.click()}
            >
              + {label}
            </button>
            <input
              id={`photoInput-${key}`}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(event) => handleSlotSelect(key, event.target.files)}
            />
            {photos[key] && (
              <p>
                {photos[key]!.file.name}
                {photos[key]!.guessedBreed && <> — AI 추정 품종: {photos[key]!.guessedBreed}</>}
              </p>
            )}
          </div>
        ))}
      </div>
      <p>얼굴이 잘 보이는 사진이 비교에 가장 도움이 돼요.</p>

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
        <legend>색상 · 여러 개 선택 가능</legend>
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
        <legend>잃어버린 날짜 · 시간</legend>
        <input
          type="date"
          value={lostDate.replace(/\./g, '-')}
          onChange={(event) => setLostDate(event.target.value.replace(/-/g, '.'))}
        />
        <select
          value={lostHour ?? ''}
          onChange={(event) =>
            setLostHour(event.target.value === '' ? undefined : Number(event.target.value))
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
        <legend>실종 위치</legend>
        <LocationInput onLocationChange={handleLocationChange} />
      </fieldset>

      <fieldset>
        <legend>외형 특징</legend>
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
        {isSubmitting ? '등록 중...' : '실종 등록하기'}
      </button>
    </section>
  )
}
