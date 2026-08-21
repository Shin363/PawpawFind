import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { getSightingReports } from './api/reports.api'
import type { SightingReportListItem } from './types'
import './ReportListPage.css'

type ReportListState =
  | { status: 'loading' }
  | { status: 'success'; reports: SightingReportListItem[] }
  | { status: 'error' }

export function ReportListPage() {
  const [requestKey, setRequestKey] = useState(0)
  const [state, setState] = useState<ReportListState>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    setState({ status: 'loading' })
    getSightingReports(controller.signal)
      .then(({ items }) => setState({ status: 'success', reports: items }))
      .catch(() => {
        if (!controller.signal.aborted) {
          setState({ status: 'error' })
        }
      })

    return () => controller.abort()
  }, [requestKey])

  return (
    <main className="report-list-page">
      <header>
        <h1>PawpawFind</h1>
        <p>주변에서 접수된 목격 제보를 확인해 보세요.</p>
      </header>

      <section aria-labelledby="report-list-title">
        <h2 id="report-list-title">목격 제보 목록</h2>

        {state.status === 'loading' && <p role="status">목격 제보를 불러오는 중입니다.</p>}

        {state.status === 'error' && (
          <div role="alert" className="report-list-page__feedback">
            <p>목격 제보를 불러오지 못했습니다.</p>
            <button type="button" onClick={() => setRequestKey((key) => key + 1)}>
              다시 시도
            </button>
          </div>
        )}

        {state.status === 'success' && state.reports.length === 0 && (
          <p className="report-list-page__feedback">등록된 목격 제보가 없습니다.</p>
        )}

        {state.status === 'success' && state.reports.length > 0 && (
          <ul className="report-list">
            {state.reports.map((report) => (
              <li key={report.id}>
                <article className="report-card">
                  <div className="report-card__badges">
                    <Badge>목격 제보</Badge>
                    <Badge>{report.speciesLabel}</Badge>
                  </div>
                  <h3>{report.title}</h3>
                  <p>{report.areaText}</p>
                  <p>{report.dateText}</p>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
