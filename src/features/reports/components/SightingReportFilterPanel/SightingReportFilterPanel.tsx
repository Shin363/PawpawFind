import { Button } from '@/components/ui/button'
import { SelectableChip } from '@/components/ui/selectable-chip'
import './SightingReportFilterPanel.css'

interface SightingReportFilterOption {
  value: string
  label: string
  disabled?: boolean
}
interface SightingReportFilterGroup {
  key: string
  label: string
  options: readonly SightingReportFilterOption[]
}
interface SightingReportFilterPanelProps {
  groups: readonly SightingReportFilterGroup[]
  selectedValues: readonly string[]
  onToggle: (value: string) => void
  onReset: () => void
  disabled?: boolean
}

export function SightingReportFilterPanel({
  disabled = false,
  groups,
  onReset,
  onToggle,
  selectedValues,
}: SightingReportFilterPanelProps) {
  return (
    <section aria-label="목격 제보 필터" className="sighting-report-filter-panel">
      <div className="sighting-report-filter-panel__header">
        <h3>필터</h3>
        <Button
          disabled={disabled || selectedValues.length === 0}
          onClick={onReset}
          variant="secondary"
        >
          필터 초기화
        </Button>
      </div>
      {groups.map((group) => (
        <fieldset disabled={disabled} key={group.key}>
          <legend>{group.label}</legend>
          <div className="sighting-report-filter-panel__options">
            {group.options.map((option) => (
              <SelectableChip
                disabled={option.disabled}
                key={option.value}
                onClick={() => onToggle(option.value)}
                selected={selectedValues.includes(option.value)}
              >
                {option.label}
              </SelectableChip>
            ))}
          </div>
        </fieldset>
      ))}
    </section>
  )
}

export type {
  SightingReportFilterGroup,
  SightingReportFilterOption,
  SightingReportFilterPanelProps,
}
