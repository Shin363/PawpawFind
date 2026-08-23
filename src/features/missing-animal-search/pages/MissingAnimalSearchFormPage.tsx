import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { SelectableChip } from '@/components/ui/selectable-chip'
import { TextInput } from '@/components/ui/text-input'
import { TimeBandSelect } from '@/components/ui/time-band-select'
import { ReportLocationPicker } from '@/features/report-location'
import { useReportForm } from '@/hooks/useReportForm'
import type { AnimalSize, Species } from '@/types/domain'
import {
  REPORT_FEATURE_GROUPS,
  REPORT_TIME_BAND_OPTIONS,
  type CreateMissingAnimalReportRequest,
  type ReportFeatureInput,
  type ReportPhotoDraft,
} from '@/types/report'
import './MissingAnimalSearchFormPage.css'

const SPECIES_OPTIONS = [
  { value: 'DOG', label: '강아지' },
  { value: 'CAT', label: '고양이' },
] as const

const SIZE_OPTIONS = [
  { value: 'SMALL', label: '소형' },
  { value: 'MEDIUM', label: '중형' },
  { value: 'LARGE', label: '대형' },
] as const

const PHOTO_SLOT_LABELS = ['정면', '측면', '전신'] as const

interface MissingAnimalSearchFormSubmission {
  report: CreateMissingAnimalReportRequest
  features: ReportFeatureInput[]
  photos: ReportPhotoDraft[]
}

interface MissingAnimalSearchFormPageProps {
  onSubmit?: (submission: MissingAnimalSearchFormSubmission) => void
}

export function MissingAnimalSearchFormPage({ onSubmit }: MissingAnimalSearchFormPageProps) {
  const [photos, setPhotos] = useState<(File | null)[]>(PHOTO_SLOT_LABELS.map(() => null))
  const form = useReportForm({ initialSize: 'SMALL' })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.isComplete) return

    onSubmit?.({
      report: {
        ...form.getRequestFields(),
        reportType: 'LOST',
      },
      features: form.features,
      photos: photos.flatMap((file, index) => (file ? [{ file, sortOrder: index + 1 }] : [])),
    })
  }

  const handlePhotoChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setPhotos((current) =>
      current.map((photo, photoIndex) => (photoIndex === index ? file : photo)),
    )
  }

  const removePhoto = (index: number) => {
    setPhotos((current) =>
      current.map((photo, photoIndex) => (photoIndex === index ? null : photo)),
    )
  }

  return (
    <main className="missing-animal-form-page">
      <header className="missing-animal-form-page__header">
        <h1>실종 동물 정보를 알려주세요</h1>
        <p>잃어버린 장소와 특징을 입력하면 보호소와 목격 제보에서 비슷한 동물을 찾아드려요.</p>
      </header>

      <form className="missing-animal-form" onSubmit={handleSubmit}>
        <section
          aria-labelledby="missing-photos-heading"
          className="missing-animal-form__section missing-animal-form__section--wide"
        >
          <div>
            <h2 id="missing-photos-heading">실종 동물 사진</h2>
            <p className="missing-animal-form__help">
              정면, 측면, 전신 사진을 각각 선택할 수 있습니다.
            </p>
          </div>
          <div className="missing-animal-form__photo-slots">
            {PHOTO_SLOT_LABELS.map((label, index) => {
              const photo = photos[index]

              return (
                <div className="missing-animal-form__photo-slot" key={label}>
                  <label>
                    <input
                      accept="image/*"
                      aria-label={`${label} 사진 선택`}
                      key={photo ? `selected-${photo.name}` : 'empty'}
                      onChange={(event) => handlePhotoChange(index, event)}
                      type="file"
                    />
                    <span aria-hidden="true" className="missing-animal-form__photo-mark">
                      {photo ? '✓' : '＋'}
                    </span>
                    <span className="missing-animal-form__photo-label">{photo?.name ?? label}</span>
                  </label>
                  {photo && (
                    <button
                      aria-label={`${label} 사진 제거`}
                      className="missing-animal-form__photo-remove"
                      onClick={() => removePhoto(index)}
                      type="button"
                    >
                      제거
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <section aria-labelledby="missing-basic-heading" className="missing-animal-form__section">
          <h2 id="missing-basic-heading">기본 정보</h2>

          <fieldset className="missing-animal-form__field-group">
            <legend>동물 종류</legend>
            <SegmentedControl<Species>
              ariaLabel="동물 종류"
              onValueChange={form.setSpecies}
              options={SPECIES_OPTIONS}
              value={form.species}
            />
          </fieldset>

          <fieldset className="missing-animal-form__field-group">
            <legend>크기</legend>
            <SegmentedControl<AnimalSize>
              ariaLabel="동물 크기"
              onValueChange={form.setSize}
              options={SIZE_OPTIONS}
              value={form.size}
            />
            <p className="missing-animal-form__help">
              소형 5kg 이하 · 중형 5–15kg · 대형 15kg 이상 정도로 선택해주세요.
            </p>
          </fieldset>
        </section>

        <div className="missing-animal-form__section">
          <ReportLocationPicker
            description="지도를 움직여 핀을 맞추면 마지막으로 본 위치가 저장돼요."
            heading="실종 장소"
            onValueChange={(location) => {
              form.setHappenPlace(location.happenPlace)
              form.setLatitude(location.latitude)
              form.setLongitude(location.longitude)
            }}
            value={{
              happenPlace: form.happenPlace,
              latitude: form.latitude,
              longitude: form.longitude,
            }}
          />

          <section
            aria-labelledby="missing-event-heading"
            className="missing-animal-form__event-section"
          >
            <h2 id="missing-event-heading">실종 날짜 · 시간</h2>
            <div className="missing-animal-form__split-fields">
              <TextInput
                label="잃어버린 날짜"
                name="eventDate"
                onChange={(event) => form.setEventDate(event.target.value)}
                required
                type="date"
                value={form.eventDate}
              />
              <TimeBandSelect
                description="모르면 비워두세요."
                label="잃어버린 시간대"
                onValueChange={form.setEventHour}
                options={REPORT_TIME_BAND_OPTIONS}
                value={form.eventHour}
              />
            </div>
          </section>
        </div>

        <section
          aria-labelledby="missing-features-heading"
          className="missing-animal-form__section missing-animal-form__section--wide"
        >
          <div>
            <h2 id="missing-features-heading">동물 특징</h2>
            <p className="missing-animal-form__help">
              털색은 필수이며 최대 3개까지 선택할 수 있습니다. 나머지는 기억나는 특징만 선택해도
              됩니다.
            </p>
          </div>

          <div className="missing-animal-form__feature-groups">
            {REPORT_FEATURE_GROUPS.map((group) => (
              <fieldset className="missing-animal-form__feature-group" key={group.category}>
                <legend>{group.label}</legend>
                <span className="missing-animal-form__selection-hint">
                  {group.selection === 'single'
                    ? '하나만'
                    : group.maxSelections === null
                      ? '여러 개 선택 가능'
                      : `최대 ${group.maxSelections}개`}
                </span>
                <div className="missing-animal-form__chips">
                  {group.options.map((option) => {
                    const selected = form.isFeatureSelected(group.category, option.keyword)

                    return (
                      <SelectableChip
                        className={
                          group.category === '털색' ? 'missing-animal-form__color-chip' : undefined
                        }
                        key={option.keyword}
                        onClick={() =>
                          form.toggleFeature({
                            category: group.category,
                            keyword: option.keyword,
                            maxSelections: group.maxSelections,
                            selection: group.selection,
                          })
                        }
                        selected={selected}
                      >
                        {'swatch' in option && (
                          <span
                            aria-hidden="true"
                            className="missing-animal-form__color-swatch"
                            style={{ backgroundColor: option.swatch }}
                          />
                        )}
                        {option.label}
                      </SelectableChip>
                    )
                  })}
                </div>
              </fieldset>
            ))}
          </div>
        </section>

        <div className="missing-animal-form__actions">
          <Button disabled={!form.isComplete} size="large" type="submit">
            비슷한 동물 찾아보기
          </Button>
        </div>
      </form>
    </main>
  )
}

export type { MissingAnimalSearchFormPageProps, MissingAnimalSearchFormSubmission }
