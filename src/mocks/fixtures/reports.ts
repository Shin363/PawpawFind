import type { SightingReportListResponse } from '@/features/reports/types'

export const sightingReportsFixture: SightingReportListResponse = {
  items: [
    {
      id: 'sighting-1',
      title: '갈색 소형견을 목격했어요',
      speciesLabel: '강아지',
      areaText: '서울시 마포구 연남동 인근',
      dateText: '2026년 8월 20일 오후',
    },
    {
      id: 'sighting-2',
      title: '치즈색 고양이를 찾습니다',
      speciesLabel: '고양이',
      areaText: '서울시 서대문구 신촌동 인근',
      dateText: '2026년 8월 19일 저녁',
    },
  ],
  page: {
    number: 0,
    size: 20,
    totalCount: 2,
  },
}
