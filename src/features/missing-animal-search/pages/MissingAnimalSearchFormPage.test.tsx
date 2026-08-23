import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MissingAnimalSearchFormPage } from './MissingAnimalSearchFormPage'

describe('MissingAnimalSearchFormPage', () => {
  it('제목과 상세 설명은 제외하고 용도별 사진 입력을 제공한다', () => {
    render(<MissingAnimalSearchFormPage />)

    expect(screen.getByRole('heading', { name: '실종 동물 정보를 알려주세요' })).toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: /제목/ })).not.toBeInTheDocument()
    expect(screen.getByLabelText('정면 사진 선택')).toHaveAttribute('accept', 'image/*')
    expect(screen.getByLabelText('측면 사진 선택')).toBeInTheDocument()
    expect(screen.getByLabelText('전신 사진 선택')).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: '잃어버린 시간대 시간을 잘 모르겠어요',
      }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: '상세 설명' })).not.toBeInTheDocument()
  })

  it('실종 정보와 복수 특징을 LOST 제보 구조로 전달한다', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const photo = new File(['photo'], 'front-view.png', { type: 'image/png' })
    render(<MissingAnimalSearchFormPage onSubmit={onSubmit} />)

    await user.upload(screen.getByLabelText('정면 사진 선택'), photo)
    await user.click(screen.getByRole('button', { name: '입력' }))
    await user.type(screen.getByRole('textbox', { name: /장소명 또는 주소/ }), '서울 강서구 화곡동')
    await user.type(screen.getByLabelText(/^잃어버린 날짜\s*\*$/), '2026-08-22')
    await user.type(screen.getByRole('spinbutton', { name: /위도/ }), '37.541')
    await user.type(screen.getByRole('spinbutton', { name: /경도/ }), '126.84')

    const colors = within(screen.getByRole('group', { name: /털색/ }))
    await user.click(colors.getByRole('button', { name: '흰색' }))
    await user.click(colors.getByRole('button', { name: '갈색' }))

    const submitButton = screen.getByRole('button', { name: '비슷한 동물 찾아보기' })
    expect(submitButton).toBeEnabled()
    await user.click(submitButton)

    expect(onSubmit).toHaveBeenCalledWith({
      report: {
        reportType: 'LOST',
        species: 'DOG',
        size: 'SMALL',
        eventDate: '2026-08-22',
        eventHour: null,
        happenPlace: '서울 강서구 화곡동',
        latitude: 37.541,
        longitude: 126.84,
      },
      features: [
        { category: '털색', keyword: '흰색' },
        { category: '털색', keyword: '갈색' },
      ],
      photos: [{ file: photo, sortOrder: 1 }],
    })
  })
})
