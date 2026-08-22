import { useParams } from 'react-router'

export function SightingReportDetailPage() {
  const { sightingId } = useParams<{ sightingId: string }>()

  return (
    <main>
      <h1>목격 제보 상세</h1>
      <p>제보 ID: {sightingId}</p>
    </main>
  )
}
