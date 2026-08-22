import { Badge } from '@/components/ui/badge'
import './SightingReportListItem.css'

interface SightingReportListItemViewModel {
  id: string
  title: string
  speciesLabel: string
  areaText: string
  dateText: string
  tags?: readonly string[]
}

interface SightingReportListItemProps {
  report: SightingReportListItemViewModel
  onSelect?: (id: string) => void
}

function Content({ report }: { report: SightingReportListItemViewModel }) {
  return (
    <>
      <div className="sighting-report-list-item__heading">
        <Badge>목격 제보</Badge>
        <Badge>{report.speciesLabel}</Badge>
      </div>
      <h3>{report.title}</h3>
      <p className="sighting-report-list-item__meta">{report.areaText}</p>
      <p className="sighting-report-list-item__meta">{report.dateText}</p>
      {report.tags && report.tags.length > 0 && (
        <ul aria-label="특징" className="sighting-report-list-item__tags">
          {report.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}
    </>
  )
}

export function SightingReportListItem({ onSelect, report }: SightingReportListItemProps) {
  if (onSelect) {
    return (
      <button
        className="sighting-report-list-item sighting-report-list-item--interactive"
        onClick={() => onSelect(report.id)}
        type="button"
      >
        <Content report={report} />
      </button>
    )
  }

  return (
    <article className="sighting-report-list-item">
      <Content report={report} />
    </article>
  )
}

export type { SightingReportListItemProps, SightingReportListItemViewModel }
