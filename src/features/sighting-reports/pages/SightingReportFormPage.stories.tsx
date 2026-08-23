import type { Meta, StoryObj } from '@storybook/react-vite'
import { userEvent, within } from 'storybook/test'
import { SightingReportFormPage } from './SightingReportFormPage'

const meta = {
  title: 'Features/SightingReports/SightingReportFormPage',
  component: SightingReportFormPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { onSubmit: () => undefined },
} satisfies Meta<typeof SightingReportFormPage>

export default meta
type Story = StoryObj<typeof meta>

export const StepOne = {} satisfies Story

export const StepTwo = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.type(
      canvas.getByRole('textbox', { name: /제목/ }),
      '연남동 골목에서 갈색 중형견 봤어요',
    )
    await userEvent.click(canvas.getByRole('button', { name: '입력' }))
    await userEvent.type(
      canvas.getByRole('textbox', { name: /장소명 또는 주소/ }),
      '서울 마포구 연남동',
    )
    await userEvent.type(canvas.getByRole('spinbutton', { name: /위도/ }), '37.5665')
    await userEvent.type(canvas.getByRole('spinbutton', { name: /경도/ }), '126.978')
    const eventDateInput = canvas.getByLabelText(/^발견 날짜\s*\*$/)
    await userEvent.clear(eventDateInput)
    await userEvent.type(eventDateInput, '2026-08-23')
    await userEvent.click(canvas.getByRole('button', { name: '갈색' }))
    await userEvent.click(canvas.getByRole('button', { name: '다음 · 특징 고르기' }))
  },
} satisfies Story
