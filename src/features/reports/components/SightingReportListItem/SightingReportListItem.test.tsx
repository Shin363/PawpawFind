import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SightingReportListItem } from './SightingReportListItem'

const report = {
  id: 'p1',
  title: '믹스견 · 갈색 · 중형',
  speciesLabel: '강아지',
  areaText: '서울 마포구 연남동 · 0.9km',
  dateText: '2026.08.11',
  tags: ['목줄 있음', '귀 접힘'],
}

describe('SightingReportListItem', () => {
  it('제보 요약과 특징을 article로 표시한다', () => {
    render(<SightingReportListItem report={report} />)
    expect(screen.getByRole('article')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: report.title })).toBeInTheDocument()
    expect(screen.getByRole('list', { name: '특징' })).toHaveTextContent('목줄 있음')
  })

  it('선택 계약이 있으면 전체 항목을 버튼으로 제공한다', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(<SightingReportListItem onSelect={onSelect} report={report} />)
    await user.click(screen.getByRole('button', { name: /믹스견/ }))
    expect(onSelect).toHaveBeenCalledWith('p1')
  })
})
