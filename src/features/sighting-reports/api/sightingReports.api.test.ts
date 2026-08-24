import { describe, expect, it } from 'vitest'
import { toSightingReportListItem } from './sightingReports.api'

describe('sightingReports API mapper', () => {
  it('백엔드의 한글 값과 nullable 필드를 포함한 제보를 목록 모델로 변환한다', () => {
    expect(
      toSightingReportListItem({
        reportId: 17,
        userId: null,
        reportType: 'FOUND',
        title: '서울에서 발견한 강아지',
        species: '강아지',
        size: '중형',
        eventDate: '2026-08-24',
        eventHour: null,
        happenPlace: '서울',
        latitude: 37.5665,
        longitude: 126.978,
        description: null,
        status: 'OPEN',
        createdAt: '2026-08-23T18:00:18.849331',
        updatedAt: '2026-08-23T18:00:18.849331',
      }),
    ).toEqual({
      id: '17',
      title: '서울에서 발견한 강아지',
      speciesLabel: '강아지',
      colorText: '',
      sizeLabel: '중형',
      areaText: '서울',
      dateText: '2026.08.24',
    })
  })
})
