import { Button } from '@/components/ui/button'
import { SightingReportListItem } from '../components/SightingReportListItem'
import { useSightingReportsQuery } from '../hooks/useSightingReportsQuery'
import './SightingReportListPage.css'

export function SightingReportListPage() {
  const { data, isError, isPending, refetch } = useSightingReportsQuery()
  const reports = data?.items ?? []

  return (
    <main className="report-list-page">
      <header>
        <h1>PawpawFind</h1>
        <p>주변에서 접수된 목격 제보를 확인해 보세요.</p>
      </header>

      <section aria-labelledby="report-list-title">
        <h2 id="report-list-title">목격 제보 목록</h2>

        {isPending && <p role="status">목격 제보를 불러오는 중입니다.</p>}

        {isError && (
          <div role="alert" className="report-list-page__feedback">
            <p>목격 제보를 불러오지 못했습니다.</p>
            <Button onClick={() => void refetch()}>다시 시도</Button>
          </div>
        )}

        {!isPending && !isError && reports.length === 0 && (
          <p className="report-list-page__feedback">등록된 목격 제보가 없습니다.</p>
        )}

        {!isPending && !isError && reports.length > 0 && (
          <ul className="report-list">
            {reports.map((report) => (
              <li key={report.id}>
                <SightingReportListItem report={report} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
