import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SightingReportFilterPanel } from './SightingReportFilterPanel'

const groups = [
  {
    key: 'species',
    label: '동물 종류',
    options: [
      { value: 'dog', label: '강아지' },
      { value: 'cat', label: '고양이' },
    ],
  },
]

describe('SightingReportFilterPanel', () => {
  it('그룹과 controlled 선택 상태를 표시하고 toggle을 알린다', async () => {
    const onToggle = vi.fn()
    const user = userEvent.setup()
    render(
      <SightingReportFilterPanel
        groups={groups}
        onReset={vi.fn()}
        onToggle={onToggle}
        selectedValues={['dog']}
      />,
    )
    expect(screen.getByRole('button', { name: '강아지' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: '고양이' }))
    expect(onToggle).toHaveBeenCalledWith('cat')
  })

  it('선택값이 없으면 초기화를 비활성화한다', () => {
    render(
      <SightingReportFilterPanel
        groups={groups}
        onReset={vi.fn()}
        onToggle={vi.fn()}
        selectedValues={[]}
      />,
    )
    expect(screen.getByRole('button', { name: '필터 초기화' })).toBeDisabled()
  })
})
