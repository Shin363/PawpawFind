import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { routeUrls } from '@/app/router/paths'
import {
  MissingAnimalSearchFormPage,
  type MissingAnimalSearchFormSubmission,
} from './MissingAnimalSearchFormPage'
import './MissingAnimalSearchFlowPage.css'

const MOCK_ANALYSIS_DELAY_MS = 1800

export function MissingAnimalSearchFlowPage() {
  const navigate = useNavigate()
  const [previewUrl, setPreviewUrl] = useState('')

  useEffect(() => {
    if (!previewUrl) return

    const timer = window.setTimeout(() => {
      navigate(routeUrls.missingAnimalSearchResult('mock-search'))
    }, MOCK_ANALYSIS_DELAY_MS)

    return () => {
      window.clearTimeout(timer)
      URL.revokeObjectURL(previewUrl)
    }
  }, [navigate, previewUrl])

  const startSearch = ({ photos }: MissingAnimalSearchFormSubmission) => {
    const firstPhoto = photos[0]?.file
    if (firstPhoto) setPreviewUrl(URL.createObjectURL(firstPhoto))
  }

  if (!previewUrl) return <MissingAnimalSearchFormPage onSubmit={startSearch} />

  return (
    <main className="missing-animal-analysis-page">
      <section aria-labelledby="analysis-title" className="missing-animal-analysis">
        <h1 id="analysis-title">비슷한 동물을 찾고 있어요</h1>
        <div className="missing-animal-analysis__photo">
          <img alt="찾고 있는 실종 동물" src={previewUrl} />
          <span aria-hidden="true" />
        </div>
        <div
          aria-label="유사 동물 검색 중"
          aria-valuemax={100}
          aria-valuemin={0}
          className="missing-animal-analysis__progress"
          role="progressbar"
        >
          <span />
        </div>
        <p>전국 보호소와 목격 제보에서 비슷한 동물을 확인하고 있어요.</p>
      </section>
    </main>
  )
}
